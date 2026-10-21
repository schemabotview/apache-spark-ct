import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { streamTree } from './tree'
import code from '../../../spine/stream/05-event-time/project/stream/event_time.py?raw'
import session from '../../../spine/stream/05-event-time/session.txt?raw'

export const eventVsArrival: Scene = ideFrame(
  'event-vs-arrival',
  'retail-pipeline',
  streamTree(5),
  { file: 'stream/event_time.py', code: code, show: [[9, 24]], highlight: [17, 18], terminal: session },
  {
    id: 'event-vs-arrival-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'late-orders',
        kind: 'table',
        label: 'Order time against arrival',
        headers: ['order', 'happened', 'arrived in'],
        values: [
          ['o1, o2, o3', '09:01–09:08', 'batch 0'],
          ['o4, o5', '09:14–09:17', 'batch 1'],
          ['o6', '09:23', 'batch 2'],
          ['o7', '09:06', 'batch 2: late'],
          ['o8', '09:31', 'batch 3'],
          ['o9', '09:02', 'batch 3: late'],
        ],
      },
      {
        id: 'time-facts',
        kind: 'list',
        icon: 'clock',
        label: 'Two clocks',
        pattern: 'storage',
        items: [
          'Event time: when the order happened, in the data',
          'Processing time: when Spark saw it, on the machine',
          'A shop that loses its network sends orders late',
          'Sales at 09:00 means event time, so group by it',
        ],
      },
    ],
  },
)
