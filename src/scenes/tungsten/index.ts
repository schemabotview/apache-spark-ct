import type { Scene } from '@graphlearning/flow'

// Course 7 (tungsten) scenes. The question is why a DataFrame beats hand-written RDD code, and the
// answer is two separate things people conflate: a different MEMORY LAYOUT (§§1–5) and a different
// EXECUTION SHAPE (§§6–8). Keeping those apart is most of what this course is for.
//
// COURSE-PLAN.md flags this course as thin in the sources — the Databricks excerpt never mentions
// Tungsten at all, and SDG covers it in passing. Grounded against the Spark documentation.

export const theObjectTax: Scene = {
  id: 'tun-object-tax',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'one',
      label: 'One short string, as a JVM object',
      pattern: 'group',
      sub: '"abc" is three bytes of information — and it is nowhere near three bytes of memory',
      cols: 4,
      children: [
        { id: 'o-hdr', label: 'object header', pattern: 'warn', sub: '~16 bytes' },
        { id: 'o-ref', label: 'a pointer to an array', pattern: 'warn', sub: '8 bytes' },
        { id: 'o-arr', label: 'the array, with ITS header', pattern: 'warn', sub: '~16 + padding' },
        { id: 'o-data', label: 'your actual data', pattern: 'service', sub: '3 bytes' },
      ],
    },
    {
      id: 'scale',
      label: 'Multiply by a billion rows',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: '~48 bytes to store 3 · each a separate heap object',
    },
    {
      id: 'gc',
      label: 'And the second cost, which is worse',
      pattern: 'group',
      sub: 'the garbage collector must walk live objects — so the cost scales with the NUMBER of them, not their size',
      cols: 2,
      children: [
        { id: 'g-count', label: 'billions of objects', pattern: 'warn', sub: 'each one the GC must trace' },
        { id: 'g-pause', label: 'pauses, not throughput', pattern: 'warn', sub: 'a third of runtime, in bad cases' },
      ],
    },
  ],
  edges: [
    { source: 'one', target: 'scale' },
    { source: 'scale', target: 'gc' },
  ],
}

export const theBinaryRow: Scene = {
  id: 'tun-binary-row',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'row',
      label: 'UnsafeRow — one row, one contiguous block of bytes',
      pattern: 'group',
      sub: 'no object headers, no pointers between fields, nothing for the GC to trace inside it',
      flow: 'LR',
      children: [
        { id: 'r-null', label: 'null bit set', pattern: 'network', sub: 'one bit per field' },
        { id: 'r-fixed', label: 'fixed-width region', pattern: 'service', sub: '8 bytes per field, always' },
        { id: 'r-var', label: 'variable-length tail', pattern: 'service', sub: 'strings and arrays live here' },
      ],
    },
    {
      id: 'trick',
      label: 'The 8-byte trick',
      pattern: 'service',
      icon: 'lightbulb',
      sub: 'the slot holds an offset and a length, not the string',
    },
    {
      id: 'gains',
      label: 'What the layout buys',
      pattern: 'group',
      sub: 'every one of these follows from "it is one block of bytes", not from any cleverness above it',
      cols: 3,
      children: [
        { id: 'ga-size', label: 'a fraction of the size', pattern: 'network', sub: 'no headers, no padding, no pointers' },
        { id: 'ga-gc', label: 'invisible to the GC', pattern: 'network', sub: 'one object, not one per field' },
        { id: 'ga-seek', label: 'field n without decoding', pattern: 'network', sub: 'read at a known byte offset' },
      ],
    },
  ],
  edges: [
    { source: 'row', target: 'trick' },
    { source: 'trick', target: 'gains' },
  ],
}

export const offHeap: Scene = {
  id: 'tun-off-heap',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'onheap',
      label: 'On-heap — inside the JVM',
      pattern: 'group',
      sub: 'Tungsten rows still live in byte arrays the JVM owns, so the GC still has to consider the array',
      cols: 2,
      children: [
        { id: 'on-who', label: 'the JVM manages it', pattern: 'network', sub: 'allocation and collection' },
        { id: 'on-cost', label: 'still traced', pattern: 'warn', sub: 'one object, but still an object' },
      ],
    },
    {
      id: 'offheap',
      label: 'Off-heap — memory Spark manages itself',
      pattern: 'group',
      sub: 'allocated outside the JVM heap through Unsafe · spark.memory.offHeap.enabled + a size',
      cols: 2,
      children: [
        { id: 'off-who', label: 'Spark manages it', pattern: 'service', sub: 'explicit allocate and free' },
        { id: 'off-cost', label: 'the GC never sees it', pattern: 'service', sub: 'no tracing at all' },
      ],
    },
    {
      id: 'honest',
      label: 'And it is not a free win',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'two pools to size by hand · measure before enabling',
    },
  ],
  edges: [
    { source: 'onheap', target: 'offheap', label: 'the further step' },
    { source: 'offheap', target: 'honest' },
  ],
}

export const encoders: Scene = {
  id: 'tun-encoders',
  padding: 0.13,
  flow: 'LR',
  nodes: [
    {
      id: 'object',
      label: 'Your JVM object',
      pattern: 'storage',
      icon: 'package',
      sub: 'case class Flight(dest: String, cnt: Long)',
    },
    {
      id: 'encoder',
      label: 'The encoder',
      pattern: 'service',
      icon: 'repeat',
      sub: 'generated code, both directions',
      cols: 1,
      children: [
        { id: 'e-to', label: 'object → bytes', pattern: 'network', sub: 'field by field, into the layout' },
        { id: 'e-from', label: 'bytes → object', pattern: 'network', sub: 'only when you actually ask' },
      ],
    },
    {
      id: 'binary',
      label: 'UnsafeRow',
      pattern: 'service',
      icon: 'binary',
      sub: 'what the engine actually operates on',
    },
    {
      id: 'cost',
      label: 'Which is the real cost of a typed Dataset',
      pattern: 'group',
      sub: 'a DataFrame stays in binary throughout; a typed lambda forces a round trip per row',
      cols: 2,
      children: [
        { id: 'c-df', label: 'DataFrame ops', pattern: 'service', sub: 'never leave the binary form' },
        { id: 'c-ds', label: 'a typed .map { … }', pattern: 'warn', sub: 'decode → your code → re-encode' },
      ],
    },
  ],
  edges: [
    { source: 'object', target: 'encoder' },
    { source: 'encoder', target: 'binary' },
    { source: 'binary', target: 'cost' },
  ],
}

export const cacheLocality: Scene = {
  id: 'tun-cache-locality',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'gap',
      label: 'The gap the layout is really exploiting',
      pattern: 'group',
      sub: 'a CPU has not been limited by arithmetic for twenty years — it is limited by waiting for memory',
      cols: 3,
      children: [
        { id: 'l-l1', label: 'L1 cache', pattern: 'service', sub: '~1 ns' },
        { id: 'l-l3', label: 'L3 cache', pattern: 'network', sub: '~20 ns' },
        { id: 'l-ram', label: 'main memory', pattern: 'warn', sub: '~100 ns — a hundred wasted cycles' },
      ],
    },
    {
      id: 'pointer',
      label: 'Pointer-chasing loses',
      pattern: 'warn',
      icon: 'alertTriangle',
      sub: 'each hop is an address the prefetcher cannot predict',
    },
    {
      id: 'contig',
      label: 'Contiguous bytes win it',
      pattern: 'group',
      sub: 'the hardware prefetcher recognises a sequential scan and fetches the next line before it is asked for',
      cols: 2,
      children: [
        { id: 'co-pre', label: 'prefetching works', pattern: 'service', sub: 'the next row is already in cache' },
        { id: 'co-sort', label: 'cache-aware sorting', pattern: 'service', sub: 'sort keys and pointers together' },
      ],
    },
  ],
  edges: [
    { source: 'gap', target: 'pointer' },
    { source: 'pointer', target: 'contig', label: 'so: lay it out flat' },
  ],
}

export const virtualCallProblem: Scene = {
  id: 'tun-virtual-calls',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'volcano',
      label: 'The classic model: every operator is an iterator',
      pattern: 'group',
      sub: 'each one calls next() on its child — the textbook design, and it is correct and general',
      flow: 'LR',
      children: [
        { id: 'v-proj', label: 'Project.next()', pattern: 'network', sub: 'calls its child' },
        { id: 'v-filt', label: 'Filter.next()', pattern: 'network', sub: 'calls its child' },
        { id: 'v-scan', label: 'Scan.next()', pattern: 'storage', sub: 'returns a row' },
      ],
      edges: [
        { source: 'v-proj', target: 'v-filt' },
        { source: 'v-filt', target: 'v-scan' },
      ],
    },
    {
      id: 'cost',
      label: 'What it costs per row',
      pattern: 'group',
      sub: 'per row, per operator — and the work inside each call is often a single comparison',
      cols: 3,
      children: [
        { id: 'c-virt', label: 'a virtual call', pattern: 'warn', sub: 'not inlinable, not predictable' },
        { id: 'c-row', label: 'an intermediate row', pattern: 'warn', sub: 'materialised between each pair' },
        { id: 'c-ratio', label: 'overhead > work', pattern: 'warn', sub: 'the call costs more than the compare' },
      ],
    },
  ],
  edges: [{ source: 'volcano', target: 'cost' }],
}

export const wholeStageCodegen: Scene = {
  id: 'tun-codegen',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'idea',
      label: 'Compile, don’t interpret',
      pattern: 'service',
      icon: 'zap',
      sub: 'Java source is generated for the stage, then compiled',
    },
    {
      id: 'result',
      label: 'What the generated method looks like',
      pattern: 'group',
      sub: 'one loop, with the filter and the projection inlined into it — the operators no longer exist as objects',
      cols: 1,
      children: [
        { id: 'g-loop', label: 'while (scan.hasNext())', pattern: 'network', sub: 'one loop for the whole stage' },
        { id: 'g-inline', label: 'if (country == "IN")', pattern: 'network', sub: 'the Filter, inlined' },
        { id: 'g-emit', label: 'emit(dest, cnt)', pattern: 'network', sub: 'the Project, inlined' },
      ],
    },
    {
      id: 'why',
      label: 'Why this is faster than the sum of its parts',
      pattern: 'group',
      sub: 'a hand-written loop is what the JIT compiler is best at, and this is now a hand-written loop',
      cols: 3,
      children: [
        { id: 'w-calls', label: 'no virtual calls', pattern: 'service', sub: 'nothing left to dispatch' },
        { id: 'w-rows', label: 'no intermediate rows', pattern: 'service', sub: 'values stay in CPU registers' },
        { id: 'w-jit', label: 'the JIT can optimize it', pattern: 'service', sub: 'unroll, vectorise, inline' },
      ],
    },
  ],
  edges: [
    { source: 'idea', target: 'result' },
    { source: 'result', target: 'why' },
  ],
}

export const seeingIt: Scene = {
  id: 'tun-seeing-it',
  padding: 0.16,
  nodes: [
    {
      id: 'code',
      kind: 'code',
      filename: 'codegen.txt',
      minCols: 76,
      label: [
        '>>> df.filter("country = \'IN\'").select("dest").explain()',
        '',
        '== Physical Plan ==',
        '*(1) Project [dest#7]                 <-- the * is the point',
        '+- *(1) Filter (country#9 = IN)',
        '   +- FileScan parquet [dest#7,country#9]',
        '',
        '# *(1) means "whole-stage codegen stage 1". Project and',
        '# Filter carry the SAME number, so they were fused into one',
        '# generated method. No * means that operator is running the',
        '# old iterator-at-a-time way.',
        '',
        '# The generated source itself:',
        '>>> df.filter(...).select(...).explain("codegen")',
        '',
        'Found 1 WholeStageCodegen subtrees.',
        'Generated code:',
        '/* 026 */   while (scan_hasNext()) {',
        '/* 027 */     UTF8String country = scan_row.getUTF8String(1);',
        '/* 028 */     if (!country.equals(IN)) continue;   // the Filter',
        '/* 029 */     UTF8String dest = scan_row.getUTF8String(0);',
        '/* 030 */     append(dest);                        // the Project',
        '/* 031 */   }',
        '',
        '# One loop. The operator tree is gone.',
      ].join('\n'),
    },
  ],
  edges: [],
}

export const whereItStops: Scene = {
  id: 'tun-where-it-stops',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'opaque',
      label: 'Codegen must see inside',
      pattern: 'service',
      icon: 'eye',
      sub: 'logic it cannot read, it cannot inline into the loop',
    },
    {
      id: 'breaks',
      label: 'What breaks the fusion',
      pattern: 'group',
      sub: 'each of these becomes a wall the generated loop stops at, and the stage splits around it',
      cols: 3,
      children: [
        { id: 'b-udf', label: 'a Python UDF', pattern: 'warn', sub: 'a different process entirely' },
        { id: 'b-scala', label: 'a Scala UDF', pattern: 'warn', sub: 'a black box, even in the JVM' },
        { id: 'b-wide', label: 'very wide rows', pattern: 'warn', sub: 'the method exceeds the JVM’s 64 KB limit' },
      ],
    },
    {
      id: 'lesson',
      label: 'Which reframes what a UDF costs',
      pattern: 'group',
      sub: 'the cost is not only running your function — it is everything around it that now cannot be fused',
      cols: 2,
      children: [
        { id: 'le-builtin', label: 'prefer a built-in', pattern: 'service', sub: 'it fuses; yours does not' },
        { id: 'le-expr', label: 'or a SQL expression', pattern: 'service', sub: 'still a tree Spark can read' },
      ],
    },
  ],
  edges: [
    { source: 'opaque', target: 'breaks' },
    { source: 'breaks', target: 'lesson' },
  ],
}

export const memoryEras: Scene = {
  id: 'tun-memory-eras',
  padding: 0.13,
  flow: 'TB',
  nodes: [
    {
      id: 'static',
      label: 'Spark 1.x — two fixed pools, and a wall between them',
      pattern: 'group',
      sub: 'you set the fractions in advance; an idle storage pool could not help a starving shuffle',
      flow: 'LR',
      children: [
        { id: 's-store', label: 'storage: 60%', pattern: 'warn', sub: 'cached data · fixed' },
        { id: 's-shuffle', label: 'shuffle: 20%', pattern: 'warn', sub: 'joins and sorts · fixed' },
      ],
    },
    {
      id: 'unified',
      label: 'Spark 1.6+ — one pool, a soft boundary, a borrow rule',
      pattern: 'group',
      sub: 'spark.memory.fraction (0.6) is the pool; storageFraction (0.5) is only the floor storage can defend',
      cols: 2,
      children: [
        { id: 'u-exec', label: 'execution can evict storage', pattern: 'service', sub: 'down to the floor' },
        { id: 'u-store', label: 'storage cannot evict', pattern: 'warn', sub: 'execution is protected — its work is lost' },
      ],
    },
    {
      id: 'now',
      label: '"My cache disappeared"',
      pattern: 'service',
      icon: 'lightbulb',
      sub: 'a big join took the memory back — as designed',
    },
  ],
  edges: [
    { source: 'static', target: 'unified', label: 'let them share' },
    { source: 'unified', target: 'now' },
  ],
}

export const tungstenScenes: Scene[] = [
  theObjectTax,
  theBinaryRow,
  offHeap,
  encoders,
  cacheLocality,
  virtualCallProblem,
  wholeStageCodegen,
  seeingIt,
  whereItStops,
  memoryEras,
]
