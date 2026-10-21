import type { TreeEntry } from '@graphlearning/flow'

// retail-pipeline as Course 3 leaves it: a virtual environment, its requirements, Spark's settings
// folder and the one job. `fresh` marks what the section adds; `active` is the file in the editor.
export function startTree(active: string, fresh: string[] = []): TreeEntry[] {
  const state = (name: string): TreeEntry['state'] => (name === active ? 'active' : fresh.includes(name) ? 'new' : undefined)
  return [
    { name: '.venv', folder: true, state: 'muted', note: 'activated' },
    { name: 'conf', state: state('conf'), children: [{ name: 'log4j2.properties' }, { name: 'spark-defaults.conf' }] },
    { name: 'jobs', children: [{ name: 'daily_sales.py', state: state('daily_sales.py') }] },
    { name: 'requirements.txt', state: state('requirements.txt') },
  ]
}
