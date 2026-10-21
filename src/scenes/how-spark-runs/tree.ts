import type { TreeEntry } from '@graphlearning/flow'

// Course 2's demo folder, as it grows: one script per section, in the order the sections add them.
// It is not the spine — the project itself starts in Course 3 — so every script builds its own session.
const FILES = ['first_job.py', 'who_does_what.py', 'connect.py', 'sample.py', 'lazy.py', 'partitions.py', 'narrow_wide.py', 'stages.py', 'recompute.py']

/** The folder after `upTo` was added, with `active` open in the editor. */
export function runsTree(upTo: string, active: string): TreeEntry[] {
  const files = FILES.slice(0, FILES.indexOf(upTo) + 1)
  const fresh = upTo === 'lazy.py' ? ['sample.py', 'lazy.py'] : [upTo]
  return [
    { name: '.venv', folder: true, state: 'muted', note: 'pyspark 4.0.1' },
    { name: 'conf', children: [{ name: 'log4j2.properties' }, { name: 'spark-defaults.conf' }] },
    { name: 'orders.json', note: 'six events' },
    ...files.map((name): TreeEntry => ({ name, state: name === active ? 'active' : fresh.includes(name) ? 'new' : undefined })),
  ]
}
