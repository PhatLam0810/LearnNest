// forked from design-sync lib/source-kit.mjs - the package-shape synth-entry
// path bundles EVERY .tsx/.jsx file under srcDir into the IIFE entry
// (`.pkg-entry.mjs`), regardless of `cfg.componentSrcMap` exclusions - those
// only drop a name from the *documented/preview* component list, not from
// the raw synth-entry file list. This repo has real components that
// `import './styles.scss'`, which esbuild's package-shape bundle has no
// loader for (`lib/bundle.mjs` intentionally ships no `.scss` loader - see
// .design-sync/NOTES.md). Since forking lib/bundle.mjs / lib/emit.mjs is
// off-limits, this fork instead keeps those files out of the synth entry
// in the first place: any `cfg.componentSrcMap[name] === null` whose name
// also matches a path segment (case-insensitive) is excluded from the
// synth-entry file list, not just the discovered-components list.
//
// Everything below is unchanged from lib/source-kit.mjs except the `comps`
// computation in step 2 (marked below) and the relative imports (repointed
// at the staged .ds-sync/lib/ since this file lives under
// .design-sync/overrides/).

import { existsSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { Project, Node, ts } from 'ts-morph';
import { leadingJsdoc, readText, slash, walk } from '../../.ds-sync/lib/common.mjs';
import { resolveDistEntry } from '../../.ds-sync/lib/bundle.mjs';
import { exportedNames, isComponentName } from '../../.ds-sync/lib/dts.mjs';

const NON_IMPL_RX = /\.(stories|test|spec)\./;
const SRC_IMPL_RX = /\.(tsx|jsx)$/;
// Dir names that don't usefully group components - skip so the emitted path
// is `components/<group>/<Name>` not `components/components/<Name>`.
const GENERIC_DIR = new Set(['components', 'component', 'src', 'lib', 'ui', 'packages', 'react']);
const slug = (s) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'general';

// [OVERRIDE] shared ts-morph project for recovering a file's default-export
// declared name (used by both defaultExportName below and
// deriveComponentsFromSrc) - one project, reused, instead of a fresh one per
// call.
const synthProject = new Project({
  skipAddingFilesFromTsConfig: true,
  compilerOptions: { jsx: ts.JsxEmit.Preserve, allowJs: true, skipLibCheck: true },
});

// [OVERRIDE] `export default function Foo()` / `export default Foo` (const
// then export-assigned) -> 'Foo'. Returns null when there's no default
// export, or its declaration has no recoverable PascalCase name (e.g. an
// inline anonymous arrow/object) - those files still get `export *`, just
// no explicit named re-export.
function defaultExportName(p) {
  const sf = synthProject.addSourceFileAtPathIfExists(p);
  if (!sf) return null;
  const decls = sf.getExportedDeclarations().get('default');
  if (!decls) return null;
  const real = decls.map((d) => d.getName?.()).find((n) => n && n !== 'default');
  return real && /^[A-Z][A-Za-z0-9]*$/.test(real) ? real : null;
}

// No .d.ts -> scan src files for PascalCase value exports via ts-morph.
function deriveComponentsFromSrc(srcFiles) {
  const project = new Project({
    skipAddingFilesFromTsConfig: true,
    compilerOptions: { jsx: ts.JsxEmit.Preserve, allowJs: true, skipLibCheck: true },
  });
  const seen = new Set();
  for (const p of srcFiles) {
    if (NON_IMPL_RX.test(p) || !SRC_IMPL_RX.test(p)) continue;
    const sf = project.addSourceFileAtPathIfExists(p);
    if (!sf) continue;
    for (const [name, decls] of sf.getExportedDeclarations()) {
      // `export default function Button()` is keyed as 'default' - recover
      // the declared name from the function/class node.
      const real = name === 'default'
        ? decls.map((d) => d.getName?.()).find((n) => n && n !== 'default')
        : name;
      if (!real || !/^[A-Z][A-Za-z0-9]*$/.test(real)) continue;
      if (decls.some((d) => Node.isVariableDeclaration(d) || Node.isFunctionDeclaration(d) || Node.isClassDeclaration(d))) {
        seen.add(real);
      }
    }
  }
  return [...seen].sort().map((name) => ({ name, group: 'general' }));
}

export async function resolvePackage(ctx) {
  const { PKG_DIR, pkgJson, ENTRY_OVERRIDE, PKG, OUT, cfg } = ctx;
  const srcMap = cfg.componentSrcMap ?? {};

  // -- 1. src/ discovery (best-effort; feeds enrichment + synth-entry fallback).
  // ASSUMPTION: source root is first of src/ | lib/ | components/. Override: cfg.srcDir.
  const srcRoot = [cfg.srcDir, 'src', 'lib', 'components']
    .map((d) => d && resolve(PKG_DIR, d))
    .find((d) => d && existsSync(d));
  const srcFiles = srcRoot ? walk(srcRoot, (n) => /\.(tsx|jsx|mdx?)$/.test(n)) : [];

  // -- 2. entry: dist if it exists, else synthesize from src/ (last resort).
  let entry = resolveDistEntry({ pkgDir: PKG_DIR, pkgJson, override: ENTRY_OVERRIDE, pkgName: PKG, soft: true });
  let synthEntry = false;
  if (!entry) {
    if (!srcRoot) {
      console.error(`[NO_DIST] ${PKG} has no built entry and no src/ to synthesize from — run its build.`);
      process.exit(1);
    }
    // [OVERRIDE] drop the file whose OWN identity matches a
    // componentSrcMap:null name from the synth-entry bundle too (not just
    // the discovered-components list) - see file header. Identity is the
    // parent directory name for an `index.*` file, else the file's own
    // basename - NOT "any path segment": two sibling files sharing a parent
    // dir (e.g. FeedbackWidget/index.tsx = FeedbackWidget,
    // FeedbackWidget/FeedbackFormModal.tsx = FeedbackFormModal) must be
    // excludable independently, and matching every segment wrongly swept
    // both out when only the first was meant to be excluded.
    const excludedNames = new Set(
      Object.entries(srcMap)
        .filter(([, v]) => v === null)
        .map(([k]) => k.toLowerCase()),
    );
    const fileIdentity = (p) => {
      const parts = p.split('/');
      const base = parts[parts.length - 1].replace(/\.(tsx|jsx)$/, '');
      return (/^index$/i.test(base) ? parts[parts.length - 2] : base).toLowerCase();
    };
    const comps = srcFiles.filter((p) => {
      if (!SRC_IMPL_RX.test(p) || NON_IMPL_RX.test(p)) return false;
      if (excludedNames.size === 0) return true;
      return !excludedNames.has(fileIdentity(p));
    });
    // [OVERRIDE] `export * from p` never re-exports p's DEFAULT export (ES
    // module semantics) - every component here is `export default Foo`, so
    // a blanket `export *` entry leaves window.<GLOBAL> with NONE of them
    // (confirmed via package-validate's [BUNDLE_EXPORT] check: 34/34 missing
    // with the unforked entry). Recover each file's real declared name
    // behind `default` (same technique as deriveComponentsFromSrc below) and
    // emit an explicit `export {default as Name} from p` alongside `export *`
    // (for any other named exports the file also has). Two files that
    // resolve to the same recovered name would collide as duplicate named
    // exports - keep only the first and warn, since that's a name clash in
    // the app's own source, not something to bundle around.
    const seenNames = new Set();
    const entryLines = comps.map((p) => {
      const real = defaultExportName(p);
      if (!real) return `export * from ${JSON.stringify(p)};`;
      if (seenNames.has(real)) {
        console.error(`[CONFIG] duplicate default-export name "${real}" — keeping the first (${p} skipped for the named re-export; still bundled via export *)`);
        return `export * from ${JSON.stringify(p)};`;
      }
      seenNames.add(real);
      return `export { default as ${real} } from ${JSON.stringify(p)};\nexport * from ${JSON.stringify(p)};`;
    });
    entry = join(OUT, '.pkg-entry.mjs');
    writeFileSync(entry, entryLines.join('\n') + '\n');
    synthEntry = true;
    console.error(
      `[NO_DIST] no built entry — synthesizing from ${comps.length} src files (run the package's build for best results)`,
    );
  }

  // -- 3. component list: from shipped .d.ts (authoritative when dist exists).
  // ASSUMPTION: components = PascalCase value exports in the .d.ts tree.
  // Override: cfg.componentSrcMap (non-null adds/pins, null excludes).
  const exported = exportedNames(PKG_DIR, pkgJson);
  const names = new Set([...exported].filter(isComponentName));
  for (const [k, v] of Object.entries(srcMap)) {
    if (v === null) { names.delete(k); continue; }
    // Names reach `<script>` blocks in the emitted HTML - reject anything
    // that isn't a plain PascalCase identifier.
    if (!/^[A-Z][A-Za-z0-9]*$/.test(k)) {
      console.error(`[CONFIG] componentSrcMap: "${k}" is not a valid component name (PascalCase identifiers only)`);
      continue;
    }
    names.add(k);
  }
  let components = [...names].sort().map((name) => ({ name, group: 'general' }));
  if (!components.length && synthEntry) {
    components = deriveComponentsFromSrc(srcFiles).filter((c) => srcMap[c.name] !== null);
  }
  if (!components.length) {
    if (cfg.cssEntry || existsSync(join(PKG_DIR, 'styles.css'))) {
      console.error('[ZERO_MATCH] no component exports — treating as tokens-only DS');
      return { shape: 'package', entry, components: [], tokensOnly: true };
    }
    console.error(`[ZERO_MATCH] no PascalCase exports in ${PKG} and no styles — nothing to sync`);
    process.exit(1);
  }

  // -- 4. src/ enrichment per component. Every miss degrades to plain-dist.
  if (srcRoot) {
    for (const c of components) {
      // Pinned via config -> skip fuzzy-find entirely.
      let hit = typeof srcMap[c.name] === 'string' ? slash(resolve(PKG_DIR, srcMap[c.name])) : null;
      if (!hit) {
        // ASSUMPTION: <Name>.tsx | <name>/<name>.tsx | <Name>/index.tsx |
        // <kebab-name>.tsx, case-insensitive; dir-match ranks above
        // bare-file match, then prefer one that actually exports `c.name`.
        // Override: cfg.componentSrcMap.
        const kebab = c.name.replace(/([a-z0-9])([A-Z])/g, '$1-$2');
        const nameRx = new RegExp(
          `(?:^|/)(?:${c.name}/(?:index|${c.name})\\.(tsx|jsx)|(?:${c.name}|${kebab})\\.(tsx|jsx))$`,
          'i',
        );
        const hits = srcFiles
          .filter((p) => nameRx.test(p) && !NON_IMPL_RX.test(p))
          .sort(
            (a, b) =>
              (b.toLowerCase().includes(`/${c.name.toLowerCase()}/`) ? 1 : 0) -
              (a.toLowerCase().includes(`/${c.name.toLowerCase()}/`) ? 1 : 0),
          );
        const exportRx = new RegExp(`export\\s+(?:default\\s+)?(?:const|let|var|function|class)\\s+${c.name}\\b`);
        hit = hits.find((p) => exportRx.test(readText(p))) ?? hits[0];
      }
      if (!hit || !existsSync(hit)) continue;
      c.srcPath = hit;
      c.doc = leadingJsdoc(readText(hit), c.name) || undefined;
      // group = last src/ path segment that isn't the component's own dir or
      // a generic container name - else JSDoc @category - else 'general'.
      c.group = slug(
        slash(relative(srcRoot, dirname(hit)))
          .split('/')
          .filter((s) => s && s.toLowerCase() !== c.name.toLowerCase() && !GENERIC_DIR.has(s.toLowerCase()))
          .at(-1)
        || (c.doc && /@category\s+(\S+)/.exec(c.doc)?.[1])
        || 'general',
      );
    }
  }

  console.error(
    `  package: ${components.length} components` +
      (srcRoot ? ` (${components.filter((c) => c.srcPath).length} src-matched)` : ' (no src/ — dist-only)'),
  );
  return { shape: 'package', entry, components, synthEntry, exported };
}
