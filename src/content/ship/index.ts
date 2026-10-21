import type { Course } from '../types'
import { packagingAndConfiguration } from './01-packaging-and-configuration'
import { deployModesAndTheDriver } from './02-deploy-modes-and-the-driver'
import { clusterManagers } from './03-cluster-managers'
import { capacityAndCost } from './04-capacity-and-cost'
import { testsAndDataQualityChecks } from './05-tests-and-data-quality-checks'
import { logsEventLogsAndTheHistoryServer } from './06-logs-event-logs-and-the-history-server'
import { failuresRetriesAndSpeculation } from './07-failures-retries-and-speculation'
import { tableFormats } from './08-table-formats'
import { backfillsAndSafeReleases } from './09-backfills-and-safe-releases'
import { securityBoundaries } from './10-security-boundaries'
import { theFinishedPipeline } from './11-the-finished-pipeline'

export const ship: Course = {
  id: 'ship',
  title: 'Ship it',
  sections: [packagingAndConfiguration, deployModesAndTheDriver, clusterManagers, capacityAndCost, testsAndDataQualityChecks, logsEventLogsAndTheHistoryServer, failuresRetriesAndSpeculation, tableFormats, backfillsAndSafeReleases, securityBoundaries, theFinishedPipeline],
}
