import type { Section } from '../types'

export const securityBoundaries: Section = {
  id: 'security-boundaries',
  title: 'Security boundaries: identities, access, transport protection, secrets, and exposed interfaces',
  scene: 'security-surface',
  focus: 'surface-table',
  slide: `## Security boundaries

**Model:** in Spark 4.0.1, security features such as authentication are **not enabled by default**. Every interface is open until you close it.

### The interfaces
- **RPC:** authentication, then network encryption
- **Shuffle and spill files:** I/O encryption
- **Web UI, history server:** TLS, login filters, view/kill ACLs
- **Spark Connect** (15002): no built-in auth — an authenticating proxy in front

### Identities and secrets
- The job's identity: a Kerberos principal on YARN, a service account on Kubernetes
- \`--conf\` secrets show in the UI unless named like secret, password, token, access key

### The misconception
"It's inside our network, so it's safe." Anyone who can reach the port can submit code that runs as the job's identity.`,
  narration:
    "Security in Spark starts with an uncomfortable default. The security documentation states that features such as authentication are not enabled by default. So every interface a deployment exposes is open until you close it. Go through them one by one. Remote procedure calls between the driver and executors: turn on spark authenticate, which uses a shared secret, and then network encryption, which depends on it. Shuffle and spill files written to local disks: turn on I O encryption. The web UI and the history server: serve them over TLS, add a servlet filter that requires login, and use access control lists to decide who may view a job or kill it. The Spark Connect server listens on port fifteen thousand and two, and it has no built-in authentication. It is designed to sit behind an authenticating proxy, so never expose it directly. Then identities. The job acts as some identity on the cluster: a Kerberos principal on YARN, a service account on Kubernetes. Give that identity only the data the job needs. And secrets. A password passed with a conf flag appears in the environment tab of the UI, unless its name matches the redaction pattern, which by default covers names containing secret, password, token or access key. Better still, keep secrets in the platform's secret store, such as Kubernetes secrets, and mount them. The misconception to drop is that being inside the company network makes this safe. Anyone who can reach an open port can submit code that runs with the job's identity and reads what it can read.",
}
