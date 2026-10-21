import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import requirements from '../../../spine/start/02-new-project/captured/requirements.txt?raw'
import session from '../../../spine/start/02-new-project/session.txt?raw'

// A real install: the replay types `pip install -q pyspark==4.0.1` into a fresh venv (from pip's
// cache), and `pip freeze` wrote the requirements file the editor shows.
export const newProject: Scene = ideFrame(
  'new-project',
  'retail-pipeline',
  [
    { name: '.venv', folder: true, state: 'new', note: 'activated' },
    { name: 'requirements.txt', state: 'active' },
  ],
  { file: 'requirements.txt', code: requirements, pattern: 'network', terminal: session },
  {
    id: 'new-project-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'needs',
        kind: 'table',
        label: 'What a PySpark project needs',
        headers: ['', 'from', 'here'],
        values: [
          ['Python', 'python.org, uv, the OS', '3.13'],
          ['PySpark', 'pip, into .venv', '4.0.1'],
          ['Py4J', 'pulled in by PySpark', '0.10.9.9'],
          ['Java', 'a JDK 17 or 21', 'OpenJDK 21'],
          ['a cluster', 'not yet: local mode', '—'],
        ],
      },
      {
        id: 'new-project-facts',
        kind: 'list',
        icon: 'package',
        label: 'pip install pyspark is all of Spark',
        pattern: 'network',
        items: [
          'The wheel carries Spark’s jars, scripts and Python API',
          'It still needs a Java runtime on the machine',
          'requirements.txt pins the exact versions we ran',
          'The venv keeps this project’s Spark apart from others',
        ],
      },
    ],
  },
)
