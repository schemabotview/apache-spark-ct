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
for (const slug of slugs) {
  const local = []
  const onErr = (e) => local.push('pageerror: ' + e.message)
  const onCon = (m) => {
    if (m.type() === 'error' && !/unique "key" prop/.test(m.text())) local.push('console: ' + m.text().slice(0, 140))
  }
  page.on('pageerror', onErr)
  page.on('console', onCon)
  await page.goto(`${BASE}/#/${slug}`, { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 900))
  await page.screenshot({ path: `${OUT}/${slug}.png` })
  const m = await page.evaluate(() => {
    const el = document.querySelector('.slide-panel')
    return el ? { scroll: el.scrollHeight, client: el.clientHeight } : null
  })
  if (m && m.scroll > m.client + 2) overflows.push(`${slug} — slide clipped by ${m.scroll - m.client}px`)
  page.off('pageerror', onErr)
  page.off('console', onCon)
  if (local.length) errors.push(`${slug} — ${local.join(' | ')}`)
}
await browser.close()

console.log(`rendered ${slugs.length} frames → ${OUT}/`)
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
