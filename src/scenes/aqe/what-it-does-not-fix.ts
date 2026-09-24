import type { Scene } from '@graphlearning/flow'

export const whatItDoesNotFix: Scene = {
  id: 'aqe-limits',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'shuffle',
      label: 'It never removes a shuffle',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'broadcasting and bucketing still beat everything here',
    },
    {
      id: 'others',
      label: 'And three more it cannot reach',
      pattern: 'group',
      sub: 'each one is outside the mechanism: AQE only ever acts at a shuffle boundary, using what that shuffle measured',
      cols: 3,
      children: [
        { id: 'o-key', label: 'a single hot key', pattern: 'warn', sub: 'one partition, nothing to cut along' },
        { id: 'o-narrow', label: 'a job with no shuffle', pattern: 'warn', sub: 'no boundary, so no re-plan' },
        { id: 'o-read', label: 'the first stage', pattern: 'warn', sub: 'nothing has been measured yet' },
      ],
    },
    {
      id: 'stats',
      label: 'And it is not a substitute for statistics',
      pattern: 'group',
      sub: 'AQE fixes the plan after the fact; ANALYZE TABLE means the first plan was right — both are worth having',
      cols: 2,
      children: [
        { id: 'sa-analyze', label: 'ANALYZE TABLE', pattern: 'service', sub: 'a better first guess' },
        { id: 'sa-aqe', label: 'AQE', pattern: 'service', sub: 'a correction to a bad one' },
      ],
    },
  ],
  edges: [
    { source: 'shuffle', target: 'others' },
    { source: 'others', target: 'stats' },
  ],
}
