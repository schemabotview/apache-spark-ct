import type { TreeEntry } from '@graphlearning/flow'

// The explorer for any step of retail-pipeline: give it the project's files as paths, the open one,
// and what the section adds. Folders come first, then files, each in the order given; a path
// ending in `/` is a folder shown closed (with an optional note after a space: 'data/out/ Parquet').
export function projectTree(paths: string[], active: string, fresh: string[] = []): TreeEntry[] {
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
  const sort = (entries: TreeEntry[]): TreeEntry[] =>
    entries
      .map((e) => (e.children ? { ...e, children: sort(e.children) } : e))
      .sort((a, b) => Number(!(a.folder || a.children)) - Number(!(b.folder || b.children)))
  return sort(root)
}
