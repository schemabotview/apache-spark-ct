import type { Scene } from '@graphlearning/flow'

// §5.5 — the final (AQE) physical plan of the 1,000,000-order run, cut at its exchanges: the
// broadcast of stores, the map side up to the partial aggregate, and the reduce side reading a
// coalesced shuffle. Numbers on the edges are from the run's stage metrics.
export const exchangeStages: Scene = {
  id: 'exchange-stages',
  title: 'Exchanges are stage boundaries',
  flow: 'TB',
  nodes: [
    {
      id: 'broadcast-side',
      label: 'Broadcast stores',
      sub: 'its own job',
      pattern: 'external',
      cols: 1,
      children: [
        { id: 'scan-stores', label: 'Scan stores', sub: '50 rows', icon: 'file' },
      ],
    },
    {
      id: 'map-side',
      label: 'Map side',
      sub: '4 tasks',
      pattern: 'service',
      cols: 2,
      children: [
        { id: 'scan-orders-1m', label: 'Scan orders', sub: '1,000,000 rows', icon: 'file' },
        { id: 'filter-join', label: 'Filter, join', sub: 'broadcast hash join', icon: 'merge' },
        { id: 'partial-agg', label: 'Partial agg', sub: 'per city, per task', icon: 'sigma' },
        { id: 'shuffle-write', label: 'Shuffle write', sub: '200 records', icon: 'harddrive' },
      ],
    },
    {
      id: 'reduce-side',
      label: 'Reduce side',
      sub: '1 task after AQE',
      pattern: 'network',
      cols: 2,
      children: [
        { id: 'shuffle-read', label: 'Shuffle read', sub: 'coalesced 200 → 1', icon: 'swap' },
        { id: 'final-agg', label: 'Final agg', sub: '50 rows out', icon: 'sigma' },
      ],
    },
  ],
  edges: [
    { source: 'broadcast-side', target: 'map-side', label: 'BroadcastExchange' },
    { source: 'map-side', target: 'reduce-side', label: 'Exchange hashpartitioning(city, 200)' },
  ],
}
