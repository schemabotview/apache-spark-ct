import type { Course } from '../types'
import { packagingAndConfiguration } from './01-packaging-and-configuration'
import { deploymentAndDriverPlacement } from './02-deployment-and-driver-placement'
import { clusterManagers } from './03-cluster-managers'
import { capacityAndCost } from './04-capacity-and-cost'
import { testingAndQuality } from './05-testing-and-quality'
import { observability } from './06-observability'
import { failureAndRecovery } from './07-failure-and-recovery'
import { tableFormats } from './08-table-formats'
import { backfillsAndReleases } from './09-backfills-and-releases'
import { securityBoundaries } from './10-security-boundaries'
import { integratedCase } from './11-integrated-case'

// Chapter 8 of docs/APACHE-SPARK-COURSE-PLAN.md — one section per numbered item, in plan order.
// Defaults and behaviour are taken from the Spark 4.0.1 configuration, submission, monitoring and
// security guides; capacity figures reuse the course's fixed retail-workload numbers.
export const production: Course = {
  id: 'production',
  title: 'Production Engineering and Integrated Reasoning',
  sections: [
    packagingAndConfiguration,
    deploymentAndDriverPlacement,
    clusterManagers,
    capacityAndCost,
    testingAndQuality,
    observability,
    failureAndRecovery,
    tableFormats,
    backfillsAndReleases,
    securityBoundaries,
    integratedCase,
  ],
}
