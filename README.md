# Architectural Template

A reusable TypeScript/Next.js repository template for projects that prefer:

- strict one-way dependencies;
- role-pure files;
- no circular dependency mesh;
- thin `page.tsx`, `layout.tsx`, and `route.ts` framework files;
- explicit orchestration;
- configuration separated from behavior;
- ports separated from adapters;
- state/actions/events/selectors owned by their subsystem rather than scattered globally;
- conservative helper usage;
- public `index.ts` files that export but do not implement.

The repository contains a deliberately tiny wired `examples` feature so the tree is not a collection of empty placeholders.

## Quick start

```bash
npm install
npm run typecheck
npm run arch:check
npm test
npm run dev
```

Then use:

- `GET /api/examples`
- `POST /api/examples` with JSON `{ "name": "Example name" }`

The persistence adapter is intentionally in-memory and ephemeral. It exists only to demonstrate architecture.

## Mental model

Folders answer:

> **Who owns this behavior?**

Files inside an owner answer:

> **What facet of that owner is this?**

File order answers:

> **How is this module constructed?**

The default intra-file order is:

```text
imports
primitives / local types / constants
private helpers (only when justified)
composition / primary behavior
exports
```

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for dependency rules and the rationale behind the tree.

## Template principle

Do not create every possible folder in every new repository. Start with the smallest valid structure and instantiate a role only when the role actually exists.

The tree here is a teaching/reference superset with real wiring.
