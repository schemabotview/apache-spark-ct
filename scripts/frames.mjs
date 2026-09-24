#!/usr/bin/env node
// Render every authored section as a frame, and report the defects that the guards cannot see.
//
// `tsc` and `vite build` pass on a scaffold that white-screens and on text rendering outside its
// card — both happened here on 2026-09-24. This is the step that catches them. It does not replace
// looking at the frames; it finds the things worth looking at, and writes the PNGs to look at.
//
// Checks per section:
//   · page errors and console errors (React's table `key` warning is filtered — it comes from the
//     engine's own table renderer, not from content)
//   · slide overflow — .slide-panel scrollHeight vs clientHeight, which is text clipped off the
//     bottom of the panel. Measured exactly rather than judged by eye.
//
// Usage:  npm run dev   (in another shell)
//         npm run frames [outDir]
import puppeteer from 'puppeteer'
import { build } from 'esbuild'
import { pathToFileURL } from 'node:url'
import { rmSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const OUT = process.argv[2] ?? 'frames'
const BASE = process.env.FRAMES_BASE ?? 'http://localhost:5173'

// Read the real registry rather than a hand-kept list, so a new section cannot be forgotten.
// The bundle has to live INSIDE the repo: src/content/index.ts re-exports from @graphlearning/shell,
// which is marked external here, so node resolves it relative to the bundle's own directory.
const dir = join('node_modules', '.cache')
mkdirSync(dir, { recursive: true })
const bundle = join(dir, 'frames-content.mjs')
await build({
  entryPoints: ['src/content/index.ts'],
  bundle: true,
  format: 'esm',
  outfile: bundle,
  platform: 'node',
  external: ['@graphlearning/*', 'react', 'react-dom'],
  logLevel: 'silent',
})
const { COURSES } = await import(pathToFileURL(bundle).href)
rmSync(bundle, { force: true })

const slugs = Object.values(COURSES).flatMap((c) => c.sections.map((s) => `${c.id}-${s.id}`))
if (!slugs.length) {
  console.log('no sections authored yet — nothing to render')
  process.exit(0)
}
mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch()
const page = await browser.newPage()
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 })

const errors = []
const overflows = []
const ribbons = []
let missingAudio = 0
for (const slug of slugs) {
  const local = []
  const onErr = (e) => local.push('pageerror: ' + e.message)
  const onCon = (m) => {
    // The engine's own table renderer emits React's list-key warning; not a content defect.
    // A missing wav also surfaces here as a bare "Failed to load resource" with no URL — the
    // response listener below is what classifies it, so drop the duplicate.
    const t = m.text()
    if (m.type() === 'error' && !/unique "key" prop/.test(t) && !/Failed to load resource/.test(t))
      local.push('console: ' + t.slice(0, 140))
  }
  // A missing narration wav 404s on every section until the Colab step has run. That is an expected
  // state of an authored-but-unvoiced course, so it is counted rather than reported as an error.
  const onResp = (r) => {
    if (r.status() === 404) {
      if (/\.wav($|\?)/.test(r.url())) missingAudio++
      else local.push('404: ' + r.url().slice(-80))
    }
  }
  page.on('pageerror', onErr)
  page.on('console', onCon)
  page.on('response', onResp)
  await page.goto(`${BASE}/#/${slug}`, { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 900))
  await page.screenshot({ path: `${OUT}/${slug}.png` })
  // How big the type ends up. `ui-flow` scales a scene to fit the pane, so a scene never overflows
  // — it shrinks. The pane is roughly square, which means BOTH a tall ribbon and a flat strip bind
  // on one axis and shrink; only a roughly square scene gets to fill both.
  //
  // Measured directly rather than proxied. An earlier version of this check measured "fraction of
  // the pane width used", which is exactly backwards for the flat case: a 5-node chain laid out
  // left-to-right uses 89% of the width and renders at 11pt, while a 3-band stacked scene uses 60%
  // and renders at 21pt. Width told me the second one was the problem. It was the best frame on the
  // page. The number that matters is the one a viewer actually reads.
  const shape = await page.evaluate(() => {
    const vp = document.querySelector('.react-flow__viewport')
    const node = document.querySelector('.react-flow__node')
    if (!vp || !node) return null
    const scale = new DOMMatrix(getComputedStyle(vp).transform).a
    const label = node.querySelector('*')
    const px = label ? parseFloat(getComputedStyle(label).fontSize) : 0
    const pane = document.querySelector('.react-flow').getBoundingClientRect()
    const r = [...document.querySelectorAll('.react-flow__node')].map((n) => n.getBoundingClientRect())
    const w = Math.max(...r.map((x) => x.right)) - Math.min(...r.map((x) => x.left))
    const h = Math.max(...r.map((x) => x.bottom)) - Math.min(...r.map((x) => x.top))
    return { pt: px * scale, aspect: w / h, paneAspect: pane.width / pane.height }
  })
  if (shape && shape.pt < 13) {
    const how = shape.aspect > shape.paneAspect * 1.6 ? 'too flat' : shape.aspect < shape.paneAspect / 1.6 ? 'too tall' : 'too much in it'
    ribbons.push(`${slug} — type renders at ${shape.pt.toFixed(0)}pt (${how}, ${shape.aspect.toFixed(1)}:1 in a ${shape.paneAspect.toFixed(1)}:1 pane)`)
  }

  const m = await page.evaluate(() => {
    const el = document.querySelector('.slide-panel')
    if (!el) return null
    // Vertical: content taller than the panel is text clipped off the bottom.
    // Horizontal: a `pre` (a code fence) or a table wider than the panel is text clipped at the
    // right edge — invisible in the markdown, obvious only on the frame.
    const wide = [...el.querySelectorAll('pre, table')]
      .filter((n) => n.scrollWidth > n.clientWidth + 2)
      .map((n) => `${n.tagName.toLowerCase()} +${n.scrollWidth - n.clientWidth}px`)
    return { scroll: el.scrollHeight, client: el.clientHeight, wide }
  })
  if (m && m.scroll > m.client + 2) overflows.push(`${slug} — slide clipped by ${m.scroll - m.client}px`)
  if (m && m.wide.length) overflows.push(`${slug} — too wide: ${m.wide.join(', ')}`)
  page.off('pageerror', onErr)
  page.off('console', onCon)
  page.off('response', onResp)
  if (local.length) errors.push(`${slug} — ${local.join(' | ')}`)
}
await browser.close()

console.log(`rendered ${slugs.length} frames → ${OUT}/`)
if (missingAudio) console.log(`  (${missingAudio} narration wav(s) missing — expected until the Colab step has run)`)
if (errors.length) {
  console.error(`\n✗ ${errors.length} section(s) with runtime errors:`)
  for (const e of errors) console.error('  ' + e)
}
if (overflows.length) {
  console.error(`\n✗ ${overflows.length} slide(s) overflowing the panel — trim the markdown:`)
  for (const o of overflows) console.error('  ' + o)
}
if (ribbons.length) {
  console.error(`\n⚠ ${ribbons.length} scene(s) render at unreadable type — the layout is binding on one axis:`)
  for (const r of ribbons) console.error('  ' + r)
  console.error("  Aim for a roughly square scene: a flat chain wants `flow: 'TB'`, a tall one `flow: 'LR'`,")
  console.error('  and one with too much in it wants less.\n')
}
if (!errors.length && !overflows.length && !ribbons.length) console.log('✓ no runtime errors, no slide overflows, type readable throughout')
else if (!errors.length && !overflows.length) console.log('✓ no runtime errors, no slide overflows')
else process.exit(1)
