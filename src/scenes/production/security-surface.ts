import type { Scene } from '@graphlearning/flow'

// §8.10 — the interfaces a Spark deployment exposes, what is on by default in 4.0.1 (authentication
// is not), and the setting or outside control that closes each one.
export const securitySurface: Scene = {
  id: 'security-surface',
  title: 'Security boundaries',
  flow: 'TB',
  nodes: [
    {
      id: 'security-conf',
      kind: 'code',
      filename: 'all false by default',
      label: `spark.authenticate             true
spark.network.crypto.enabled   true
spark.io.encryption.enabled    true
spark.ssl.enabled              true
spark.acls.enable              true`,
    },
    {
      id: 'surface-table',
      kind: 'table',
      label: 'What is exposed',
      headers: ['interface', 'default', 'protect with'],
      values: [
        ['RPC between processes', 'no auth', 'authenticate, crypto'],
        ['shuffle and spill files', 'plaintext', 'io.encryption'],
        ['web UI :4040, :18080', 'open', 'filters, ACLs, TLS'],
        ['Spark Connect :15002', 'no auth', 'proxy in front'],
        ['secrets in --conf', 'in the UI', 'redaction, K8s secrets'],
      ],
    },
  ],
  edges: [],
}
