import type { Section } from '../types'

export const clusterManagers: Section = {
  id: 'cluster-managers',
  title: 'Compare deployment responsibilities on standalone, YARN, and Kubernetes',
  scene: 'cluster-managers',
  focus: 'manager-table',
  slide: `## Standalone, YARN, Kubernetes

**Objective:** see what each cluster manager takes care of, and what stays with your team.

### The three
- **Standalone:** Spark's own master and workers; basic sharing, no Python cluster mode
- **YARN:** Hadoop's resource manager; **queues** share capacity, an external shuffle service keeps shuffle files
- **Kubernetes:** the driver pod creates executor pods from a **container image**, using a service account; quotas share, shuffle tracking replaces the shuffle service

**Worked:** moving the daily job between them changes \`--master\` and a few settings — never the code.

### The misconception
"Kubernetes runs Spark for you." It schedules pods. **Images, permissions, logs and quotas** are still yours to operate.`,
  narration:
    "Spark four supports three cluster managers, and the choice is mostly about who operates what. The standalone manager is Spark's own master and workers. It is the simplest to start, and fine for a dedicated cluster, but it offers only basic sharing between teams, and, as we saw, it cannot run Python applications in cluster mode. YARN is Hadoop's resource manager. If your organization already runs Hadoop, YARN gives you queues, so several teams can share capacity with limits, and you pick a queue at submit time. When executors are added and removed dynamically, an external shuffle service keeps their shuffle files available. Kubernetes runs the driver as a pod, and the driver creates executor pods from a container image you build, which becomes your unit of packaging. The driver needs a service account allowed to create those pods. Namespaces and quotas share the cluster between teams, and instead of an external shuffle service, dynamic allocation relies on shuffle tracking, keeping executors that still hold shuffle data. Notice what the worked case shows: moving the daily job between the three changes the master URL and a few settings, never the application code. That is the point of the cluster manager boundary. The misconception to drop is that Kubernetes, or any manager, runs Spark for you. It schedules containers. Building the images, granting permissions, collecting logs, and setting quotas are still your team's work, and the table is a list of exactly those responsibilities.",
}
