import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { shipTree } from './tree'
import code from '../../../spine/ship/10-security/project/ops/secrets.py?raw'
import session from '../../../spine/ship/10-security/session.txt?raw'

export const securitySurface: Scene = ideFrame(
  'security-surface',
  'retail-pipeline',
  shipTree(10),
  { file: 'ops/secrets.py', code: code, show: [[8, 21]], highlight: [10, 15, 17], terminal: session },
  {
    id: 'security-surface-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'ports-table',
        kind: 'table',
        label: 'What a Spark deployment exposes',
        headers: ['port', 'what', 'protected by'],
        values: [
          ['4040', 'driver UI and REST', 'spark.ui.filters, ACLs'],
          ['7077', 'standalone master', 'spark.authenticate'],
          ['18080', 'history server', 'filters, ACLs'],
          ['15002', 'Spark Connect', 'nothing built in'],
        ],
      },
      {
        id: 'security-facts',
        kind: 'list',
        icon: 'shieldcheck',
        label: 'Security is off until you turn it on',
        pattern: 'storage',
        items: [
          'Identities: spark.authenticate, then UI ACLs',
          'Encryption: spark.network.crypto, spark.io.encryption, TLS',
          'Secrets: from the environment, never on the command line',
          'Redaction hides a value\'s name, not where it was copied',
        ],
      },
    ],
  },
)
