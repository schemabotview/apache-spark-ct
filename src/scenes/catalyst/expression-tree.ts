import type { Scene } from '@graphlearning/flow'

// §2 — the expression tree. This is one of the two diagram classes COURSE-PLAN.md flagged as
// unproven in the engine, so: VERDICT, from the rendered frame on 2026-09-24.
//
// The engine does NOT draw a classic edge-linked tree. A parent with `children` renders as a BOX
// CONTAINING them, so a tree comes out as nesting. For an expression that is arguably better than
// edges — the containment is the precedence, visibly — but it means each operator is a group HEADER
// rather than a node, and a bare symbol like "-" is far too small to read at capture size. So every
// operator here carries its name as well as its symbol, and a sub saying what it does.
//
// Anything genuinely needing edge-linked siblings (a plan tree where nodes are peers) should be
// drawn as a chained group instead, the way §3 and §7 do it.
export const expressionTree: Scene = {
  id: 'cat-expression-tree',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'src',
      label: '((price+5)*200)-6 < budget',
      pattern: 'network',
      icon: 'filecode',
      sub: 'one expression, as you wrote it',
    },
    {
      id: 'lt',
      label: '<  LessThan',
      pattern: 'service',
      sub: 'the root — a Predicate, returning true or false',
      cols: 2,
      children: [
        {
          id: 'minus',
          label: '−  Subtract',
          pattern: 'service',
          sub: 'its left child is everything below',
          cols: 2,
          children: [
            {
              id: 'times',
              label: '×  Multiply',
              pattern: 'network',
              sub: 'evaluated before the subtraction',
              cols: 2,
              children: [
                {
                  id: 'plus',
                  label: '+  Add',
                  pattern: 'network',
                  sub: 'the innermost bracket — evaluated first',
                  cols: 2,
                  children: [
                    { id: 'e-price', label: 'price', pattern: 'storage', sub: 'AttributeReference' },
                    { id: 'e-5', label: '5', pattern: 'user', sub: 'Literal' },
                  ],
                },
                { id: 'e-200', label: '200', pattern: 'user', sub: 'Literal' },
              ],
            },
            { id: 'e-6', label: '6', pattern: 'user', sub: 'Literal' },
          ],
        },
        { id: 'e-budget', label: 'budget', pattern: 'storage', sub: 'AttributeReference' },
      ],
    },
    {
      id: 'note',
      label: 'Nesting IS precedence',
      pattern: 'service',
      icon: 'lightbulb',
      sub: 'the shape already says what happens first',
    },
  ],
  edges: [
    { source: 'src', target: 'lt', label: 'parsed once, into this' },
    { source: 'lt', target: 'note' },
  ],
}
