#!/usr/bin/env node
// Scene text linter.
//
// `ui-flow` computes every position and size, which is the point — but a LEAF card is laid out at a
// fixed width and does NOT grow to fit its text. Overflowing text renders outside the card's border,
// on top of whatever is below it. tsc and `vite build` both pass on that: it is only visible on the
// rendered frame, which is exactly the failure mode the workspace's verification bar exists for.
//
// Every limit below was measured off rendered 1920×1080 frames on 2026-09-24, not guessed. A GROUP
// node (one with `children`) is full-width and is held to much looser limits.
//
// Run: node scripts/lint-scenes.mjs   (wired into `npm run check`)
import { build } from 'esbuild'
import { pathToFileURL } from 'node:url'
import { mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const LIMITS = {
  leafLabel: 28, // wraps past the card's top border beyond this
  leafSub: 66, // spills out of the bottom border beyond this — but this assumes a 1–2 line LABEL.
  //              A leaf whose label wraps to 3 lines has less room, and can clip at ~55. The frame
  //              render is the authority; this limit catches the common case cheaply.
  leafToken: 22, // an UNBREAKABLE token (a config key, an identifier) cannot wrap at all
  groupLabel: 70, // the group header is full-width, so it is far more forgiving
  groupSub: 120,
  edgeLabel: 40, // rides the edge midpoint; longer lands on a node
  codeLine: 76, // CODE_MIN_COLS — a longer line widens the card and shrinks the whole scene
}

// A node is laid out full-width — like a group — if it has children, or if it is one of the wide
// kinds. `table` and `plot` size themselves to their content and are not held to the leaf limits.
const WIDE_KINDS = new Set(['table', 'plot'])

// The bundle lives inside the repo so that externalised @graphlearning/* packages resolve from
// node_modules relative to it, rather than from a temp directory where they do not exist.
const dir = join('node_modules', '.cache')
mkdirSync(dir, { recursive: true })
const out = join(dir, 'lint-scenes.mjs')
await build({
  entryPoints: ['src/scenes/index.ts'],
  bundle: true,
  format: 'esm',
  outfile: out,
  platform: 'node',
  external: ['@graphlearning/*', 'react', 'react-dom'],
  logLevel: 'silent',
})
const { SCENES } = await import(pathToFileURL(out).href)
rmSync(out, { force: true })

const problems = []
const note = (scene, id, what, len, max, text) =>
  problems.push(`${scene} · ${id} · ${what} is ${len} (max ${max})\n      ${JSON.stringify(text)}`)

function walkNode(scene, n) {
  const isGroup = (Array.isArray(n.children) && n.children.length > 0) || WIDE_KINDS.has(n.kind)
  if (n.kind === 'code') {
    const over = String(n.label).split('\n').filter((l) => l.length > LIMITS.codeLine)
    for (const l of over) note(scene, n.id, `code line`, l.length, LIMITS.codeLine, l)
  } else {
    const maxLabel = isGroup ? LIMITS.groupLabel : LIMITS.leafLabel
    const maxSub = isGroup ? LIMITS.groupSub : LIMITS.leafSub
    if (n.label && n.label.length > maxLabel)
      note(scene, n.id, `${isGroup ? 'group' : 'leaf'} label`, n.label.length, maxLabel, n.label)
    if (n.sub && n.sub.length > maxSub)
      note(scene, n.id, `${isGroup ? 'group' : 'leaf'} sub`, n.sub.length, maxSub, n.sub)
    if (!isGroup && n.label) {
      const longest = String(n.label).split(/\s+/).sort((a, b) => b.length - a.length)[0] ?? ''
      if (longest.length > LIMITS.leafToken)
        note(scene, n.id, 'unbreakable token in leaf label', longest.length, LIMITS.leafToken, longest)
    }
  }
  for (const e of n.edges ?? []) checkEdge(scene, e)
  checkCycles(scene, n.id, n.edges)
  for (const c of n.children ?? []) walkNode(scene, c)
}

// A scene's edges are laid out as a DAG. A CYCLE cannot be drawn, so the engine breaks one edge
// arbitrarily: the nodes linearise in an order nobody chose, and the back-edge renders as a stub
// pointing at nothing. Both guards pass and it looks plausible until you read the arrows.
// Found the hard way in topology §1 on 2026-09-24 — three processes talking in a loop.
function findCycle(edges) {
  const adj = new Map()
  for (const e of edges) {
    if (!adj.has(e.source)) adj.set(e.source, [])
    adj.get(e.source).push(e.target)
  }
  const state = new Map() // 1 = on the current path, 2 = done
  const path = []
  const walk = (n) => {
    if (state.get(n) === 1) return path.slice(path.indexOf(n)).concat(n)
    if (state.get(n) === 2) return null
    state.set(n, 1)
    path.push(n)
    for (const next of adj.get(n) ?? []) {
      const found = walk(next)
      if (found) return found
    }
    path.pop()
    state.set(n, 2)
    return null
  }
  for (const n of adj.keys()) {
    const found = walk(n)
    if (found) return found
  }
  return null
}

function checkCycles(scene, id, edges) {
  const cycle = findCycle(edges ?? [])
  if (cycle)
    problems.push(`${scene} · ${id} · CYCLE in the edges — the layout cannot draw it\n      ${cycle.join(' → ')}`)
}

function checkEdge(scene, e) {
  if (e.label && e.label.length > LIMITS.edgeLabel)
    note(scene, `${e.source}→${e.target}`, 'edge label', e.label.length, LIMITS.edgeLabel, e.label)
}

for (const [id, scene] of Object.entries(SCENES)) {
  for (const n of scene.nodes) walkNode(id, n)
  for (const e of scene.edges) checkEdge(id, e)
  checkCycles(id, '(top level)', scene.edges)
}

// Slide markdown length is a cheap proxy for the panel overflow that scripts/frames.mjs measures
// exactly. Calibrated on 2026-09-24 against rendered 1920x1080 frames: at or below ~950 characters
// a slide fits; at ~1050 and above it is clipped. Tables cost more height per character than
// bullets, so this is a warning rather than a failure — frames.mjs is the authority.
const contentBundle = join(dir, 'lint-content.mjs')
await build({
  entryPoints: ['src/content/index.ts'],
  bundle: true,
  format: 'esm',
  outfile: contentBundle,
  platform: 'node',
  external: ['@graphlearning/*', 'react', 'react-dom'],
  logLevel: 'silent',
})
const { COURSES } = await import(pathToFileURL(contentBundle).href)
rmSync(contentBundle, { force: true })
const longSlides = []
for (const c of Object.values(COURSES))
  for (const sec of c.sections)
    if (sec.slide.length > 1000) longSlides.push(`${c.id}-${sec.id} — ${sec.slide.length} chars`)
if (longSlides.length) {
  console.warn(`\n⚠ ${longSlides.length} slide(s) over the ~950-char budget — likely to clip; confirm with npm run frames:`)
  for (const l of longSlides) console.warn('  ' + l)
  console.warn('')
}

if (problems.length) {
  console.error(`\n✗ ${problems.length} scene text overflow(s) — these render OUTSIDE the card border:\n`)
  for (const p of problems) console.error('  ' + p)
  console.error('\n  Fix by shortening, or by giving the node `children` so it lays out as a group.\n')
  process.exit(1)
}
console.log(`✓ scene text within layout limits (${Object.keys(SCENES).length} scenes)`)
