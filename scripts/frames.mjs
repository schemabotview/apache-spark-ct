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
if (!errors.length && !overflows.length) console.log('✓ no runtime errors, no slide overflows')
else process.exit(1)
