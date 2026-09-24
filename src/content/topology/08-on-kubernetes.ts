import type { Section } from '../types'

export const onKubernetes: Section = {
  id: 'on-kubernetes',
  title: 'On Kubernetes: everything is a pod',
  scene: 'topology-kubernetes',
  focus: 'catch',
  slide: `## On Kubernetes

The current default target, and the model is simple: **every Spark process is a pod.**

1. \`spark-submit\` talks to the Kubernetes **API server**
2. K8s schedules the **driver pod**
3. The driver then requests **executor pods** itself — Spark is its own cluster manager here

### Dynamic allocation
Idle executors are handed back; new ones appear under load. Pay for what you use.

### The catch nobody mentions until it bites
An executor that goes away **takes its shuffle files with it.**

Shuffle output lives on the executor's local disk. If that executor is scaled down, evicted, or reclaimed as a spot instance, the reduce side has nothing to fetch — and the stage upstream has to be **recomputed from scratch.**

So dynamic allocation needs somewhere else for those files to live: a shuffle service, or storage-backed shuffle. Without one, autoscaling quietly makes your job slower.

> Also: executor pods need enough \`memoryOverhead\` for the JVM's non-heap memory, or K8s OOM-kills the container and Spark never sees a Java error.`,
  narration:
    "Kubernetes is where new Spark deployments go, so it's worth knowing the shape. The model is simple: every Spark process is a pod. Spark-submit talks to the Kubernetes API server. Kubernetes schedules a driver pod. And then the driver requests executor pods for itself — which means Spark is acting as its own cluster manager here, using Kubernetes as the resource layer rather than delegating scheduling to something like YARN. The headline feature is dynamic allocation. Executors that go idle are handed back; under load, new ones appear. You pay for what you use, and on cloud infrastructure that's a real saving. Now here's the catch, and it's the thing nobody mentions until it bites you. An executor that goes away takes its shuffle files with it. Shuffle output is written to the executor's own local disk. If that executor is scaled down because it looked idle, or evicted by Kubernetes, or reclaimed because it was a spot instance, then the reduce side of that shuffle has nothing to fetch from — and Spark has to recompute the entire upstream stage. So dynamic allocation and shuffle data are in tension, and you have to give those files somewhere else to live: an external shuffle service, or storage-backed shuffle. Without one, turning on autoscaling to save money can quietly make your jobs slower and more expensive. One more Kubernetes-specific trap worth naming: executor pods need enough memory overhead configured for the JVM's non-heap memory — thread stacks, off-heap buffers, the Python process if you have one. Get that wrong and Kubernetes OOM-kills the container at the operating-system level. Spark never sees a Java exception, so you get a dead executor and no useful error.",
}
