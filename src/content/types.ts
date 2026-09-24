// The content model now lives in @graphlearning/shell — the shell renders it, so it owns it. This
// file stays as the repo-local alias every content file already imports (`import type { Section }
// from '../types'`), so authoring is unchanged.
export type { Section, Course } from '@graphlearning/shell'
