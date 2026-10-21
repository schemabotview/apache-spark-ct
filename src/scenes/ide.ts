import type { Scene, SceneNode, TreeEntry } from '@graphlearning/flow'

// The IDE frame every course from 3 on is built from — ONE fixed template, so every panel sits at the
// same pixels in every section and a viewer always knows where to look:
//
//   explorer (EXPLORER_W, full height) | editor (EDITOR_COLS × EDITOR_H)  | side (SIDE_W, full height)
//                                       80 columns: PEP 8's line limit, so a well-formatted line always fits
//                                       | terminal docked underneath (TERMINAL_H)
//
// The sizes are floors (minW / minH): a file longer than the editor must be folded with `show`, not
// allowed to grow the pane — check-render.mjs fails any IDE frame whose panels move.
//
// This is python-ct's template with ONE deliberate difference: the split between editor and terminal.
// A Spark job's evidence is in what it prints — a show() table, an explain() plan, a stage count — so
// the terminal gets 14 lines and the editor 18 rows (python-ct: 10 and 21). Each is 61px of chrome
// plus 22px a line, with 10px to spare. The total is unchanged: explorer + editor + side is 1632 wide
// and editor + terminal is 856 tall, 1.91:1 — the shape of the scene area under the section header at
// 16:9 (3840×2020 at 4K), so the frame is fitted edge to edge. The terminal is 84 characters wide at
// the editor's width, and scripts/spine.py wraps output there, as a real terminal that wide does: a
// longer line would widen the centre column and move the side pane. Every side card is stretched to
// SIDE_W. Code and terminal text come from spine/ via `?raw`, so a frame can only show what
// scripts/spine.py has replayed.

export const EXPLORER_W = 300
export const EDITOR_COLS = 80
export const EDITOR_W = 792
export const EDITOR_H = 467
export const TERMINAL_H = 379
export const SIDE_W = 520
const GAP = 10

export interface Pane {
  file: string
  code: string
  show?: [number, number][]
  highlight?: number[]
  pattern?: SceneNode['pattern']
  terminal?: string
  title?: string
}

export const trim = (text: string) => text.replace(/\n+$/, '')

/**
 * A long run as a real terminal shows it: only the `keep` ranges of lines (1-based, inclusive; a
 * negative number counts from the end, -1 being the last line), each gap folded to `··· N lines` —
 * the same mark the editor uses. An error's last lines are what is on screen when the command
 * returns, so a frame keeps those and the command, and folds the rest.
 */
export function fold(session: string, ...keep: [number, number][]): string {
  const lines = trim(session).split('\n')
  const at = (n: number) => (n < 0 ? lines.length + n + 1 : n)
  const kept = new Set<number>()
  for (const [from, to] of keep) for (let n = at(from); n <= at(to); n++) kept.add(n)
  const out: string[] = []
  let hidden = 0
  lines.forEach((line, i) => {
    if (kept.has(i + 1)) {
      if (hidden) out.push(`··· ${hidden} line${hidden === 1 ? '' : 's'}`)
      hidden = 0
      out.push(line)
    } else hidden++
  })
  if (hidden) out.push(`··· ${hidden} line${hidden === 1 ? '' : 's'}`)
  return out.join('\n')
}

/** The 1-based number of the first line of `session` that starts with `prefix`. */
export const lineOf = (session: string, prefix: string) => trim(session).split('\n').findIndex((l) => l.startsWith(prefix)) + 1

// A bare side group is a column of cards: each one is stretched to the column, not the group.
const fill = (side: SceneNode): SceneNode =>
  side.bare && side.children ? { ...side, minW: SIDE_W, children: side.children.map((c) => ({ ...c, minW: SIDE_W })) } : { ...side, minW: SIDE_W }

export function ideFrame(id: string, project: string, tree: TreeEntry[], pane: Pane | SceneNode, side: SceneNode): Scene {
  const centre: SceneNode =
    'code' in pane
      ? {
          id: `${id}-centre`,
          label: pane.file,
          bare: true,
          gap: 'tight',
          children: [
            {
              id: `${id}-editor`, kind: 'code', filename: pane.title ?? pane.file, label: trim(pane.code), show: pane.show,
              highlight: pane.highlight, pattern: pane.pattern ?? 'storage', minCols: EDITOR_COLS, minH: EDITOR_H,
            },
            { id: `${id}-terminal`, kind: 'terminal', filename: `Terminal — ${project}`, label: trim(pane.terminal ?? ''), span: 'all', minH: TERMINAL_H },
          ],
        }
      : { ...pane, minW: EDITOR_W, minH: EDITOR_H + GAP + TERMINAL_H }
  return {
    id,
    padding: 0.04,
    flow: 'LR',
    align: 'start',
    stretch: true,
    gap: 'tight',
    nodes: [
      { id: `${id}-explorer`, kind: 'tree', label: project, tree, minW: EXPLORER_W },
      centre,
      { id: `${id}-side`, label: 'side', bare: true, framed: true, minW: SIDE_W, children: [fill(side)] },
    ],
    edges: [],
  }
}
