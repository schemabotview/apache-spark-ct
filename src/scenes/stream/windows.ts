import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { streamTree } from './tree'
import code from '../../../spine/stream/06-windows/project/stream/windows.py?raw'
import session from '../../../spine/stream/06-windows/session.txt?raw'

export const windowTimeline: Scene = ideFrame(
  'window-timeline',
  'retail-pipeline',
  streamTree(6),
  { file: 'stream/windows.py', code: code, show: [[12, 27]], highlight: [14, 15], terminal: session },
  {
    id: 'window-timeline-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'window-0900',
        kind: 'table',
        label: 'The 09:00 window, batch by batch',
        headers: ['batch', '09:00', 'what it added'],
        values: [
          ['0', '80.00', 'o1, o2, o3'],
          ['1', '105.00', 'o2 again: 25.00'],
          ['2', '135.00', 'o7, late: 30.00'],
          ['3', '140.00', 'o9, late: 5.00'],
        ],
      },
      {
        id: 'window-facts',
        kind: 'list',
        icon: 'layers',
        label: 'Windows with no limit on lateness',
        pattern: 'storage',
        items: [
          'A window is a group key: [09:00, 09:10) by event time',
          'A late order updates the window it belongs to',
          'So every window stays open, and in state, for ever',
          'Complete mode re-emits every window on every batch',
        ],
      },
    ],
  },
)
