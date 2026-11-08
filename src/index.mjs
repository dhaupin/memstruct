// src/index.mjs - the memstruct programmatic surface.
export { mergeStores, pick, clock, isVisible, contentHash, canonicalize } from './merge.mjs'
export { lintStore, lintRecord } from './lint.mjs'
export { auditMerge, runCase, discoverCases } from './audit-merge.mjs'
