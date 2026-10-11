// Content budget guard. Four silent failures the engine does NOT catch for you — each builds green
// and breaks only on screen, so they are checked here:
//
//   1. LEAF CARDS are a fixed NODE_W×NODE_H (210×96). Only containers grow to fit their text
//      (layout.ts headerHeight). A leaf whose label/sub overruns the ~134px text column spills
//      outside its card, top and bottom — the text block is vertically centred.
//   2. SLIDES do not scale to fit. useSlideScale sets `zoom = paneWidth / 806` — width-proportional
//      only — so type size is fixed by the frame and an over-long slide CLIPS at the bottom
//      (.slide-panel is `align-items: safe center`, which falls back to start when content
//      overflows). The pane is ~1080 DESIGN px tall, so the check MODELS the rendered height.
//
//      Character count is a poor proxy and was the earlier check: a bullet-heavy slide renders far
//      taller than a prose one of the same length. The slide that actually clipped was 869 chars
//      (modelling 1198px) while a 895-char slide rendered fine (953px) — the bullets each wrapped to
//      two lines. Height is what matters.
//   3. A `focus:` on a Section that names no node in its scene is a silent no-op — SceneView marks
//      `__focus` by id comparison and simply never matches, so the section renders with nothing lit.
//   4. A SECTION WITH NO WAV narrates nothing. The app resolves audio by convention —
//      public/audio/<course>/<section-id>.wav — so a renamed section id or a missed file plays
//      silence in the app and records a SILENT segment, with no error anywhere.
//
// NOT checked here: the `icon:` registry guard that data-warehousing/sql/linux carry. Theirs reads
// src/render-engine/*Icons.ts — a path the engine extraction deleted, which is why `npm run check`
// throws ENOENT in those three repos. The published @graphlearning/flow does not enumerate its icon
// keys (dist/lucideIcons.d.ts is just `Record<string, LucideIcon>`), so there is nothing to read
// against. Keep icon names honest by eye until the package exports the registry.
//
// Run: npm run check
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

// --- leaf-card budget -------------------------------------------------------------------------
// A leaf card is 210×96 with a 134px text column (icon 26 + gap 14 + padding 18×2). What matters is
// how many LINES the text wraps to, and the ceiling is the CARD'S OWN HEIGHT — not another repo's
// tolerance. Practical rule: keep the LABEL to 2 wrapped lines; 2 label + 2 sub = 76px and fits.
// 88, not the 92 the sibling repos carry. 92 is the card's own height, so a text block modelling at
// exactly 92 has zero slack and overflows on screen — two did, in `partitioning`: a 2-line label
// over a 3-line sub lands on 92.0 precisely and passes a `> CARD_H_MAX` test. Four pixels of margin
// costs one word and removes the whole boundary case.
const CARD_H_MAX = 88
const LABEL_CPL = 12 // chars per line at 18px/600 in a 134px column (word-wrapped, measured)
const SUB_CPL = 20 // chars per line at 13px
const LINE_LABEL = 21.6 // 18px × 1.2
const LINE_SUB = 15.6 // 13px × 1.2
// Landscape design metrics, read off index.css (.stage--section .slide-panel__scaler).
// Lowered from the 1100 the sibling repos carry. 1100 is the ceiling at a true 16:9 frame; every
// `storage` slide modelled between 1021 and 1096, passed this guard, and then clipped its last line
// in a review window whose viewport was shorter than 16:9 (browser chrome eats ~190px of an already
// short laptop screen, so a 1600×990 window renders at about 0.53 rather than 0.5625). Authoring to
// 1000 costs two bullets a slide and makes the frame safe to review anywhere. The `models` course,
// authored before this was found, sits at 753–904 and renders correctly in every window tried.
const SLIDE_H_MAX = 1000
const PANE = 806, PAD_X = 60, FS = 26
const TEXT_W = PANE - PAD_X * 2 // 686
const LI_W = TEXT_W - 30 // li has padding-left: 30
// An ORDERED list indents further than a bulleted one — the number sits in its own gutter, so the
// text column is ~43px narrower. Measured off a rendered runbook slide whose numbered command list
// wrapped a line more than the model predicted, and clipped.
const LI_W_OL = TEXT_W - 73
const BODY_LH = FS * 1.45
const H2_H = FS * 1.73 * 1.15
const H3_H = FS * 1.2 * 1.2
const CPX = 12.4 // px per character at 26px IBM Plex Sans (measured off a rendered slide)

/** Wrapped line count for one markdown block at the given column width. */
function textLines(text, widthPx) {
  // **bold** is ~10% wider at weight 700 — pad it so a bold-heavy line wraps when it really does.
  const padded = text.replace(/\*\*(.+?)\*\*/g, (_, b) => b + 'x'.repeat(Math.ceil(b.length * 0.1)))
  // `inline code` renders as a monospace CHIP: horizontal padding either side, and a wider glyph
  // than the body face. Counting the bare characters underestimated a chip-heavy slide badly enough
  // to pass a runbook slide that clipped its last line on screen — a numbered list of commands is
  // almost all chips. Two characters of allowance per chip is calibrated against the slides that
  // DID render correctly — three flagged several that were verified fine on screen.
  const chipped = padded.replace(/`([^`]+)`/g, (_, c) => c + 'xx')
  const clean = chipped.replace(/[*`_]/g, '')
  const cpl = Math.floor(widthPx / CPX)
  let n = 1
  let cur = 0
  for (const w of clean.split(/\s+/)) {
    const add = w.length + (cur ? 1 : 0)
    if (cur + add > cpl && cur) {
      n++
      cur = w.length
    } else cur += add
  }
  return n
}

/** Modelled rendered height of a slide, in design px. Adjacent CSS margins COLLAPSE to their max. */
function slideHeight(md) {
  const blocks = []
  let ul = null
  const closeUl = () => {
    if (ul) {
      blocks.push({ mt: 0, h: ul.lines * BODY_LH + (ul.items - 1) * 14, mb: 18 })
      ul = null
    }
  }
  for (const raw of md.split('\n')) {
    const l = raw.trim()
    if (!l) continue
    if (l.startsWith('## ')) {
      closeUl()
      blocks.push({ mt: 0, h: H2_H, mb: 20 })
    } else if (l.startsWith('### ')) {
      closeUl()
      blocks.push({ mt: 30, h: H3_H, mb: 12 })
    } else if (/^([-*]|\d+\.)\s/.test(l)) {
      ul ??= { lines: 0, items: 0 }
      ul.items++
      ul.lines += textLines(l.replace(/^([-*]|\d+\.)\s/, ''), /^\d/.test(l) ? LI_W_OL : LI_W)
    } else {
      closeUl()
      blocks.push({ mt: 0, h: textLines(l, TEXT_W) * BODY_LH, mb: 16 })
    }
  }
  closeUl()
  let h = 0
  let prevMb = 0
  blocks.forEach((b, i) => {
    h += (i === 0 ? 0 : Math.max(prevMb, b.mt)) + b.h
    prevMb = b.mb
  })
  return Math.round(h) // CSS zeroes the last child's margin-bottom
}

/** Word-aware line count for `text` in a column `cpl` characters wide. */
// A hyphen IS a break opportunity in CSS, so `Non-deterministic` wraps into two rendered lines in a
// 12-char column — but splitting on whitespace alone counted it as one long word on one line, and
// the card it was in overflowed with a green check. Hyphens are turned into spaces here, which
// models the break and costs one character of width per hyphen (erring on the safe side).
function wrapLines(text, cpl) {
  let lines = 1
  let cur = 0
  for (const w of text.replace(/-/g, ' ').split(/\s+/)) {
    const add = w.length + (cur ? 1 : 0)
    if (cur + add > cpl && cur) {
      lines += 1
      cur = w.length
    } else cur += add
  }
  return lines
}

// A long UNBREAKABLE token overflows SIDEWAYS, which the height model above cannot see: wrapLines
// puts it on a line of its own and counts it as one line, so the height looks fine while the text
// spills past the card's edge. Hyphens ARE break opportunities in CSS; underscores, dots, slashes and
// parentheses are NOT — so `/Volumes/catalog/schema/name/…` cannot wrap at all.
// Calibrated from what renders: `hive_metastore` (14) fits a label, `catalog.schema.table` (20) fits
// a sub, `/Volumes/catalog/schema/name/…` (30) overflowed.
const LABEL_TOKEN_MAX = 14
const SUB_TOKEN_MAX = 20

/** The longest run of characters with no break opportunity in it. */
// NOTE: `_` is NOT stripped here, unlike the slide/height models above. In a slide, an underscore
// is usually markdown emphasis and does not render; in a scene LABEL it is a literal glyph, and
// crucially it is not a break opportunity in CSS. Stripping it undercounted every snake_case
// identifier by one character per underscore, which is how `on_schema_change` (16) passed the
// 14-char label budget as "onschemachange" (14) and then overflowed its card on screen.
const longestToken = (text) =>
  text
    .replace(/[*`]/g, '')
    .split(/[\s\-\u2013\u2014]+/)
    .reduce((a, b) => (b.length > a.length ? b : a), '')

/** Modelled rendered height of a leaf card's text block. */
const cardHeight = (label, sub) =>
  wrapLines(label, LABEL_CPL) * LINE_LABEL + (sub ? 2 + wrapLines(sub, SUB_CPL) * LINE_SUB : 0)

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.ts') ? [p] : []
  })

const problems = []

// --- scenes: leaf-card label/sub budget ------------------------------------------------------
for (const file of walk('src/scenes')) {
  const src = readFileSync(file, 'utf8')
  // A node object is a leaf unless it declares `children:` before the next `id:`.
  const nodeRe = /\{\s*id: '([\w-]+)',([\s\S]*?)(?=\n\s*\{\s*id: '|\n\s*\],|\n\s*\}\s*,?\s*$)/g
  for (const [, id, body] of src.matchAll(nodeRe)) {
    // Containers grow to fit (layout.ts headerHeight); tiles and every CONTENT-SIZED kind size
    // themselves from their own content, so the fixed 210x96 leaf budget does not apply to them.
    // `plot` and `memory` belong in this list for exactly the same reason `code` and `table` do —
    // a plot's `label`/`sub` are its caption block, which plotMetrics reserves height for, so the
    // leaf model flagged every plot in this repo at ~114px against a 92px ceiling that is not its
    // ceiling. (The sibling repos' copies of this file still omit both; neither uses those kinds.)
    if (/\bchildren:/.test(body) || /\bkind: '(code|table|memory|plot)'/.test(body) || /variant: 'tile'/.test(body)) continue
    // BOTH quote styles. A label containing an apostrophe has to be written in double quotes, and
    // the single-quote-only regex this started as simply did not see those nodes — one of them
    // ("The candidate's log is at least as complete") overflowed its card with a green check.
    const label = (body.match(/\blabel: '([^']*)'/) || body.match(/\blabel: "([^"]*)"/) || ['', ''])[1] || (src.match(new RegExp(`id: '${id}',\\s*\\n?\\s*label: ['"]([^'"]*)['"]`)) || ['', ''])[1]
    const sub = (body.match(/\bsub: '([^']*)'/) || body.match(/\bsub: "([^"]*)"/) || ['', ''])[1]
    if (!label) continue
    const h = cardHeight(label, sub)
    if (h > CARD_H_MAX) {
      problems.push(`${file}  node "${id}"  card ${Math.round(h)}px > ${CARD_H_MAX}: "${label}" / "${sub}"`)
    }
    for (const [field, text, max] of [
      ['label', label, LABEL_TOKEN_MAX],
      ['sub', sub, SUB_TOKEN_MAX],
    ]) {
      if (!text) continue
      const tok = longestToken(text)
      if (tok.length > max) {
        problems.push(`${file}  node "${id}"  ${field} token ${tok.length}>${max} cannot wrap: ${tok}`)
      }
    }
  }
}

// --- content: slide budget --------------------------------------------------------------------
for (const file of walk('src/content')) {
  const src = readFileSync(file, 'utf8')
  const m = src.match(/slide: `([\s\S]*?)`,\n  narration/)
  if (!m) continue
  const slide = m[1].replace(/\\`/g, '`')
  const h = slideHeight(slide)
  if (h > SLIDE_H_MAX) problems.push(`${file}  slide ${h}px > ${SLIDE_H_MAX} — clips at the bottom`)
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
  readdirSync('public/audio').filter((c) => readdirSync(join('public/audio', c)).some((f) => f.endsWith('.wav'))),
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
