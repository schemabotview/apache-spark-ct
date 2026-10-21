// Render guard: opens every section the way the recorder does (3840×2160, ?capture=1) and measures
// the real frame. Fails on text that leaves its node (a sizer under-reserving), a node that scrolls,
// or a slide panel in a scene-only course. This is the check check-content.mjs cannot model — but it
// is still a floor: a frame can pass and read badly. The owner reviews the rendered route.
//
// Run: npm run check (after check-content). PUPPETEER_EXECUTABLE_PATH picks the browser if needed.
import { mkdir, readFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'
import { createServer } from 'vite'
import puppeteer from 'puppeteer'

const PORT = 5189
const temp = join('node_modules', '.cache', 'apache-spark-render')
await mkdir(temp, { recursive: true })
const bundle = join(temp, 'content.mjs')
await build({
  stdin: { contents: `export { COURSES } from './src/content'`, resolveDir: process.cwd(), loader: 'ts' },
  outfile: bundle, bundle: true, platform: 'node', format: 'esm', logLevel: 'silent',
  external: ['@graphlearning/shell'],
})
const { COURSES } = await import(pathToFileURL(join(process.cwd(), bundle)).href)
const slugs = Object.values(COURSES).flatMap((c) => c.sections.map((s) => `${c.id}-${s.id}`))

// Node ids must be unique within a scene, and this is checked BEFORE the browser starts: the engine
// resolves a node's parent by id, so a child that shares its parent's id (easy with ideFrame, which
// names its own wrappers `<id>-explorer`, `<id>-centre`, `<id>-side`) becomes its own parent and the
// renderer's ancestor walk never ends — the page hangs and the check dies on a timeout naming nothing.
const raw = { name: 'raw', setup: (b) => {
  b.onResolve({ filter: /\?raw$/ }, (a) => ({ path: join(a.resolveDir, a.path.slice(0, -4)), namespace: 'raw' }))
  b.onLoad({ filter: /.*/, namespace: 'raw' }, async (a) => ({ contents: await readFile(a.path, 'utf8'), loader: 'text' }))
} }
const scenesBundle = join(temp, 'scenes.mjs')
await build({
  stdin: { contents: `export { SCENES } from './src/scenes'`, resolveDir: process.cwd(), loader: 'ts' },
  outfile: scenesBundle, bundle: true, platform: 'node', format: 'esm', logLevel: 'silent',
  external: ['@graphlearning/*'], plugins: [raw],
})
const { SCENES } = await import(pathToFileURL(join(process.cwd(), scenesBundle)).href)
const duplicates = []
for (const scene of Object.values(SCENES)) {
  const seen = new Set()
  const walk = (nodes) => nodes.forEach((n) => {
    if (seen.has(n.id)) duplicates.push(`${scene.id}: node id '${n.id}' is used twice — the renderer would hang`)
    seen.add(n.id)
    walk(n.children ?? [])
  })
  walk(scene.nodes)
}
if (duplicates.length) {
  console.error(duplicates.join('\n'))
  process.exit(1)
}

const problems = []
const ide = []
const server = await createServer({ server: { host: '127.0.0.1', port: PORT, strictPort: true }, logLevel: 'silent' })
let browser
try {
  await server.listen()
  // Chrome refuses to start as root without --no-sandbox (a container, a CI runner)
  browser = await puppeteer.launch({ headless: true, args: process.getuid?.() === 0 ? ['--no-sandbox'] : [] })
  const page = await browser.newPage()
  await page.setViewport({ width: 3840, height: 2160 })
  for (const slug of slugs) {
    await page.goto(`http://127.0.0.1:${PORT}/?capture=1#/${slug}`, { waitUntil: 'networkidle0' })
    await page.waitForSelector('.flow-node', { timeout: 15000 })
    await page.evaluate(() => document.fonts.ready)
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
    const found = await page.evaluate(() => {
      const out = []
      if (document.querySelector('.slide-panel')) out.push('a slide panel is on screen')
      for (const node of document.querySelectorAll('.flow-node')) {
        const box = node.getBoundingClientRect()
        const walk = document.createTreeWalker(node, NodeFilter.SHOW_TEXT)
        while (walk.nextNode()) {
          const text = walk.currentNode
          if (!text.textContent.trim()) continue
          const range = document.createRange()
          range.selectNodeContents(text)
          for (const r of range.getClientRects())
            if (r.right > box.right + 2 || r.bottom > box.bottom + 2 || r.left < box.left - 2 || r.top < box.top - 2)
              out.push(`node "${node.dataset.id}": text leaves its box — "${text.textContent.trim().slice(0, 50)}"`)
        }
        for (const el of node.querySelectorAll('*'))
          if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflowX !== 'visible')
            out.push(`node "${node.dataset.id}": content is clipped sideways`)
      }
      return [...new Set(out)]
    })
    for (const f of found) problems.push(`${slug}  ${f}`)
    const panes = await page.evaluate(() => {
      const box = (suffix) => {
        const el = [...document.querySelectorAll('.flow-node[data-id]')].find((n) => n.dataset.id.endsWith(suffix))
        if (!el) return null
        const r = el.getBoundingClientRect()
        return [r.left, r.top, r.width, r.height].map((v) => Math.round(v))
      }
      return { explorer: box('-explorer'), side: box('-side'), editor: box('-editor'), terminal: box('-terminal') }
    })
    if (panes.explorer) ide.push({ slug, panes })
  }
} finally {
  await browser?.close()
  await server.close()
  await rm(temp, { recursive: true, force: true })
}

// Every IDE frame (one with an explorer) must put its panels at the SAME pixels as the first one —
// the template in src/scenes/ide.ts exists so the viewer's eye never has to look for them.
const [ref] = ide
for (const { slug, panes } of ide.slice(1))
  for (const pane of ['explorer', 'side', 'editor', 'terminal']) {
    const a = ref.panes[pane]
    const b = panes[pane]
    if (!a || !b) continue
    if (a.some((v, i) => Math.abs(v - b[i]) > 1))
      problems.push(`${slug}  the ${pane} pane is at [${b}], not [${a}] as in ${ref.slug} — an IDE frame's panels must not move`)
  }

if (problems.length) {
  console.error(`\n✗ ${problems.length} render problem(s) at 3840×2160:`)
  for (const p of problems) console.error('  ' + p)
  process.exit(1)
}
console.log(`✓ ${slugs.length} section(s) render cleanly at 3840×2160; ${ide.length} IDE frame(s) share one layout`)
