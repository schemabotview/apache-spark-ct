import type { Section } from '../types'

export const cacheLocality: Section = {
  id: 'cache-locality',
  title: 'The layout is the speedup, not the code',
  scene: 'tun-cache-locality',
  focus: 'contig',
  slide: `## The layout is the speedup

A CPU hasn't been limited by arithmetic for twenty years. It's limited by **waiting for memory.**

| | |
|---|---|
| **L1 cache** | ~1 ns |
| **L3 cache** | ~20 ns |
| **Main memory** | **~100 ns** — a hundred wasted cycles |

### Pointer-chasing loses that race
Every hop is a fresh address the prefetcher couldn't predict. Objects scattered across the heap mean a cache miss **per field**.

### Contiguous bytes win it
The hardware prefetcher recognises a sequential scan and fetches the next cache line **before it's asked for**. By the time you want row 2, it's already in L1.

Tungsten also does **cache-aware sorting**: sort keys and pointers are kept together, so comparisons stay in cache instead of dereferencing into the heap.

> None of this is a faster algorithm. It's the same work, arranged so the CPU doesn't wait.`,
  narration:
    "Here's the part that makes Tungsten more than a memory saving. Modern CPUs have not been limited by arithmetic for about twenty years. They're limited by waiting for memory. The numbers are worth internalising. Reading from L1 cache takes roughly one nanosecond. L3, about twenty. Main memory, around a hundred. So a cache miss costs you something like a hundred cycles during which the processor is doing nothing at all — it's stalled, waiting for bytes to arrive. Now think about what pointer-chasing does to that. Your row is an object. It has a reference to a String, which is somewhere else on the heap. That String has a reference to a char array, somewhere else again. Reading one field means following a chain of addresses, and each hop is an address the hardware prefetcher had no way to predict. So you get a cache miss per field, and your CPU spends its life waiting. Now the contiguous layout. Rows are laid out one after another in memory. The prefetcher is very good at recognising a sequential scan — it notices you're walking forward and starts fetching the next cache line before you ask for it. By the time you want row two, it's already sitting in L1. The stall disappears. Tungsten leans into this further with cache-aware sorting: when sorting, it keeps the sort keys and the pointers together in one array, so comparisons read from cache rather than dereferencing back into the heap for every comparison. The thing to take away is that none of this is a cleverer algorithm. It's exactly the same work, arranged so the processor isn't waiting.",
}
