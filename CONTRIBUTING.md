# Contributing to memstruct

memstruct is a small, frozen standard. The bar for changing it is high on purpose: a standard that moves is not a standard.

## Before you open a PR

Run the gate. It is the same one CI and the publish lane run:

```text
npm test          # the battery
npm run check     # test + language + action pins + spec/schema + docs + conformance + sync + the standard's own check
```

A red gate blocks a merge. A red gate also blocks a publish, because `npm run check` is `prepublishOnly`.

## The rules that matter

- **The spec governs.** If your change alters behavior, change `spec/SPEC.md` first, then `src/`. `scripts/check-spec-consistency.cjs` refuses a drift between the spec and `schema/store-1.json`.
- **Additive-first.** A new optional field is a MINOR revision and does not move `memstruct@1`. Removing, renaming, or changing the meaning of an envelope field is a MAJOR bump with a migration note.
- **Every norm ships a case that breaks it.** A new lint refusal needs a fixture that trips it. A new merge norm needs a case in `conformance/cases/` that fails without it. A check that never fails proves nothing.
- **Refuse the envelope, carry the body.** Unknown fields are data, never violations. If your change makes memstruct refuse a field it does not recognize, it is wrong.
- **Language-neutral.** The interop surface is the CLI. Do not add a rule that only a JavaScript implementation can satisfy.
- **Pins, never floats.** GitHub Action refs are 40-hex SHAs with a `# vN` comment.
- **Prose flows.** No commit-time hard-wrap. Paragraphs flow.

## Reporting

Open an issue. If you are proposing a format or merge change, say which of the four properties your change touches and cite the engine that already holds the behavior. memstruct is a picture of what engines do, not a design exercise.
