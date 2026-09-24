import type { Course } from '../types'
import { threeProcesses } from './01-three-processes'
import { theDriver } from './02-the-driver'
import { sparkSessionSection } from './03-sparksession'
import { executorsSection } from './04-executors'
import { clusterManagerSection } from './05-the-cluster-manager'
import { localModeSection } from './06-local-mode'
import { clientVsCluster } from './07-client-vs-cluster'
import { onKubernetes } from './08-on-kubernetes'
import { sparkSubmitSection } from './09-spark-submit'
import { failureModes } from './10-failure-modes'

// Course 2 of the spine — "what is actually running, and where". The arc names the three processes
// and their strict division of labour (§1), then takes each in turn: the driver and the two ways
// people kill it (§2), its entry point (§3), the executor and why cores are the real unit (§4), and
// the cluster manager's job, which is NOT scheduling (§5). §§6–8 vary exactly one thing — where the
// driver lands — across local, client/cluster and Kubernetes. §9 reads spark-submit as a summary of
// all of it, and §10 closes on the asymmetry that matters most: an executor dying is survivable by
// design, and the driver dying is not.
export const topology: Course = {
  id: 'topology',
  title: 'What runs where when you submit a Spark job',
  sections: [
    threeProcesses,
    theDriver,
    sparkSessionSection,
    executorsSection,
    clusterManagerSection,
    localModeSection,
    clientVsCluster,
    onKubernetes,
    sparkSubmitSection,
    failureModes,
  ],
}
