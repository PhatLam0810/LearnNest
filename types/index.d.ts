// Placeholder types root for /design-sync tooling only.
//
// The design-sync converter (see .ds-sync/, .design-sync/) needs a package
// with no `types`/`typings` field to have SOME small `types/`-style folder
// at the package root; otherwise it falls back to scanning the whole repo
// for .d.ts files, which loops through the self-referencing
// node_modules/webapp junction the converter creates for package
// resolution and runs out of memory. This file keeps that scan scoped to
// an empty, harmless folder instead. Not imported or used by the app.
export {};
