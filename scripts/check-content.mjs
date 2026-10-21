// Content guard. Silent failures the engine does NOT catch for you — each builds green and breaks
// only on screen or in the recording:
//
//   1. A SLIDE on a section. This course is scene-only; a slide brings the panel back.
//   2. A `focus:` that names no node in its scene is a silent no-op — SceneView marks `__focus` by
//      id comparison and simply never matches, so the section renders with nothing lit.
//   3. A SECTION WITH NO WAV narrates nothing. The app resolves audio by convention —
//      public/audio/<course>/<section-id>.wav — so a renamed section id or a missed file plays
//      silence in the app and records a SILENT segment, with no error anywhere.
//
// Whether text fits its node is NOT modelled here any more: under @graphlearning/flow 2.x cards grow
// to fit their text, so the old 210x96 leaf model and the slide-height model described nothing real.
// scripts/check-render.mjs measures the rendered frames instead.
//
// Run: npm run check
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.ts') ? [p] : []
  })

const problems = []

// --- content: every section is scene-only and narrated -------------------------------------
// This course has no slides (docs/APACHE-SPARK-COURSE-PLAN.md): a `slide:` would bring the panel back and halve
// the frame. An empty narration records a silent segment, like a missing wav.
for (const file of walk('src/content')) {
  if (!/\/\d\d-[\w-]+\.ts$/.test(file)) continue
  const src = readFileSync(file, 'utf8')
  if (/\bslide:/.test(src)) problems.push(`${file}  has a slide — sections in this repo are scene-only`)
  if (!/\bnarration:\s*["'`][^"'`]/.test(src)) problems.push(`${file}  has no narration`)
}

// --- content: every `focus` must name a node in that section's scene -------------------------
// SceneView sets `__focus` by comparing ids, so a focus that matches nothing just fails to light
// anything — no error, no warning. Node ids are collected per scene file; a module with no top-level
// Scene id is a shared node factory, and its ids are in scope for every scene that spreads it.
const sceneNodeIds = new Map()
const sharedIds = []
for (const file of walk('src/scenes')) {
  const src = readFileSync(file, 'utf8')
  const consts = new Map([...src.matchAll(/^\s*(\w+): '([\w-]+)',$/gm)].map((m) => [m[1], m[2]]))
  const ids = [
    ...[...src.matchAll(/\bid: '([\w-]+)',/g)].map((m) => m[1]),
    ...[...src.matchAll(/\bid: \w+\.(\w+),/g)].map((m) => consts.get(m[1])).filter(Boolean),
  ]
  const sceneId = (src.match(/^\s*id: '([\w-]+)',$/m) || [])[1]
  if (!sceneId || !/:\s*Scene\s*=/.test(src)) sharedIds.push(...ids)
  else sceneNodeIds.set(sceneId, new Set(ids))
}
for (const [, ids] of sceneNodeIds) for (const id of sharedIds) ids.add(id)
for (const file of walk('src/content')) {
  const src = readFileSync(file, 'utf8')
  const focus = (src.match(/\bfocus: '([\w-]+)'/) || [])[1]
  if (!focus) continue
  const scene = (src.match(/\bscene: '([\w-]+)'/) || [])[1]
  const ids = sceneNodeIds.get(scene)
  if (!ids) problems.push(`${file}  scene '${scene}' not found`)
  else if (!ids.has(focus)) problems.push(`${file}  focus '${focus}' names no node in scene '${scene}' — nothing will light up`)
}

// --- content: every section has its narration wav ---------------------------------------------
// src/content/<course>/NN-<id>.ts  ⇄  public/audio/<course>/<id>.wav
//
// Gated PER COURSE on that course having at least one wav. A course still being written has none at
// all — audio is a single Colab pass at the end of authoring — and reporting ten known-missing files
// on every run just trains you to ignore the guard. What it must catch is a course whose audio HAS
// been generated and is now incomplete: a renamed section id, or one file that never came back. So
// the moment a course has its first wav, every section in it is required to have one.
const coursesWithAudio = new Set(
  readdirSync('public/audio').filter((c) => statSync(join('public/audio', c)).isDirectory() && readdirSync(join('public/audio', c)).some((f) => f.endsWith('.wav'))),
)
for (const file of walk('src/content')) {
  const parts = file.split('/')
  if (parts.length !== 4 || parts[3] === 'index.ts') continue // src/content/<course>/<section>.ts only
  const course = parts[2]
  if (!coursesWithAudio.has(course)) continue // pre-Colab: nothing generated for this course yet
  const src = readFileSync(file, 'utf8')
  if (!/:\s*Section\s*=/.test(src)) continue
  const id = (src.match(/\bid: '([\w-]+)',/) || [])[1]
  const wav = join('public/audio', course, `${id}.wav`)
  if (!existsSync(wav)) problems.push(`${file}  no narration wav at ${wav} — the section plays silence`)
}

if (problems.length) {
  console.error(`✗ ${problems.length} content-budget violation(s):\n` + problems.map((p) => '  ' + p).join('\n'))
  process.exit(1)
}
console.log('✓ content budgets OK')
