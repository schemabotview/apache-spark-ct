import type { TreeEntry } from '@graphlearning/flow'

// The explorer for any step of retail-pipeline: give it the project's files as paths, the open one,
// and what the section adds. Folders come first, then files, each alphabetical, as an editor shows
// them; a path ending in `/` is a folder shown closed (with an optional note after a space:
// 'data/out/ Parquet'). Folders named in `collapse` are shown closed with a count, unless the open
// file is inside — the explorer must fit its pane, and a tree taller than 856px moves every panel.
export function projectTree(paths: string[], active: string, fresh: string[] = [], collapse: string[] = []): TreeEntry[] {
  const root: TreeEntry[] = [{ name: '.venv', folder: true, state: 'muted', note: 'activated' }]
  const state = (path: string): TreeEntry['state'] => (path === active ? 'active' : fresh.some((f) => path === f || path.startsWith(f.replace(/\/?$/, '/'))) ? 'new' : undefined)
  for (const raw of paths) {
    const [path, ...note] = raw.split(' ')
    const parts = path.replace(/\/$/, '').split('/')
    let level = root
    parts.forEach((name, i) => {
      const last = i === parts.length - 1
      const here = parts.slice(0, i + 1).join('/')
      let entry = level.find((e) => e.name === name)
      if (!entry) {
        entry = last && !path.endsWith('/') ? { name } : { name, folder: true }
        if (last && path.endsWith('/')) entry = { name, folder: true, note: note.join(' ') || undefined }
        if (!last) entry.children = []
        const s = state(last ? path.replace(/\/$/, '') : here)
        if (s && (last || s === 'new')) entry.state = s
        level.push(entry)
      }
      if (!last) level = entry.children ?? (entry.children = [])
    })
  }
  const count = (e: TreeEntry): number => (e.children ? e.children.reduce((n, c) => n + count(c), 0) : 1)
  const sort = (entries: TreeEntry[], at: string): TreeEntry[] =>
    entries
      .map((e) => {
        const here = at ? `${at}/${e.name}` : e.name
        if (e.children && collapse.includes(here) && !active.startsWith(`${here}/`) && e.state !== 'new')
          return { name: e.name, folder: true, note: `${count(e)} files` }
        return e.children ? { ...e, children: sort(e.children, here) } : e
      })
      .sort((a, b) => Number(!(a.folder || a.children)) - Number(!(b.folder || b.children)) || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
  return sort(root, '')
}
