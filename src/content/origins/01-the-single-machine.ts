import type { Section } from '../types'

export const theSingleMachine: Section = {
  id: 'the-single-machine',
  title: 'Where one machine stops',
  scene: 'origins-single-machine',
  focus: 'wall',
  slide: `## Where one machine stops

Spark exists because of a **hardware** fact, not a software fashion.

### The free lunch
For thirty years, the same program got faster every year. Clock speeds rose; nobody changed any code. **1995: 100 MHz. 2005: 3 GHz.**

### Then it stopped
Not ambition — **physics**. Power and heat rise faster than clock speed, so making a single core faster stopped paying.

### The industry turned sideways
- More **cores** at the same speed, then more **machines**
- A single-threaded program gets **nothing** from either
- The cost of going faster moved out of the hardware and **into your program**

> That's the shift Spark is an answer to: the hardware stopped solving the problem for you.`,
  narration:
    "It's worth starting with why any of this exists, because Spark isn't a fashion — it's a response to something that happened to hardware. For about thirty years, programmers had what people later called a free lunch. You wrote a program, and next year it ran faster. The year after, faster again. You changed nothing. Processor clock speeds kept climbing — a hundred megahertz in the mid-nineties, a gigahertz by 2000, three gigahertz by about 2005 — and every program on earth got faster for free. Then it stopped. And it stopped for a reason nobody could engineer around: physics. Power consumption and heat output rise much faster than clock speed does, so pushing a single core faster stopped being worth it. The chip would melt, or cost more in electricity than it saved in time. So the industry turned sideways instead. Rather than one core getting faster, you got more cores at the same speed. Then more sockets. Then more machines. Here's the uncomfortable part: a single-threaded program gets absolutely nothing from any of that. Four cores don't make it four times faster. They make it exactly as fast as before, with three cores idle. The cost of going faster moved out of the hardware and into your program — somebody now has to write code that splits work across cores, and then across machines, and handles the parts that go wrong. That's the shift. Everything in this course is about a system built to make that somebody's job survivable.",
}
