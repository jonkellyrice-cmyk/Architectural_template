# Architecture

This template is intentionally organized as a dependency DAG rather than a mesh.

## Dependency direction

```text
app (framework files)
   │
   ├──────────────► presentation
   │
   └──────────────► composition
                         │
             ┌───────────┼─────────────┐
             ▼           ▼             ▼
       presentation  application  infrastructure
                         │             │
                         ▼             │
                       domain ◄────────┘
                         │
                         ▼
                       kernel
```

The rule is not that every project needs every folder. The rule is that once a role exists, it has one architectural reason to change.

## Layer responsibilities

- `kernel/` — universal pure primitives. Knows no higher layer.
- `domain/` — business/domain meaning, invariants, policies, domain state.
- `application/` — use cases and ports. Coordinates domain behavior.
- `infrastructure/` — adapters that implement application ports.
- `presentation/` — HTTP/UI translation and rendering.
- `composition/` — the ordinary place that wires sibling implementations together.
- `config/` — typed values only. Configuration is read by composition and injected.
- `app/` — thin Next.js framework entry files.
- `scripts/` — development/repository operations, never production semantics.
- `tests/` — assertions and fixtures, never required production behavior.

## Four organizational axes

Use different axes at different scales:

1. **Architectural role → folder**
2. **Owned subsystem / bounded context → folder inside the layer**
3. **Facet (`types`, `state`, `actions`, `events`, `selectors`) → file inside its owner**
4. **Imports → primitives → conservative helpers → composition → exports → order within a file**

Do not turn every axis into a top-level folder.

## No sideways mesh

Sibling domain modules should not import one another to coordinate workflows.

Instead of:

```text
domain/a ─────► domain/b
```

prefer:

```text
        application/use-case
             /       \
            ▼         ▼
        domain/a   domain/b
```

The higher layer owns orchestration.

The same principle applies to adapters: two adapters do not orchestrate each other. Application code describes the operation; composition injects both implementations.

## Cross-cutting capabilities

A concern may be cross-cutting conceptually without becoming globally owned implementation.

For example telemetry is represented as:

```text
application/ports/telemetry.ts
            ▲
            │ implements
infrastructure/adapters/telemetry/
```

Callers depend on the capability (port), not the concrete adapter.

## Barrel rule

`index.ts` files are public APIs only. They contain exports, not implementation.

Code inside a folder should import concrete sibling files rather than importing its own barrel. This avoids many circular-dependency traps.

## Helpers

There is deliberately no global `src/helpers/`.

A helper stays private to the owner it helps. If many unrelated owners genuinely need the same pure operation, promote it deliberately to a kernel primitive rather than dumping it into a helper bucket.

## Example wiring

The included `examples` feature demonstrates the full path:

```text
POST /api/examples
    ↓
app/api/examples/route.ts
    ↓
presentation HTTP controller
    ↓
application create-example use case
    ↓
domain createExample primitive + name policy
    ↓
application repository port
    ↓
in-memory infrastructure adapter
```

Domain creation also emits a domain event. The application sends that event through a telemetry port. The infrastructure console telemetry adapter observes it.

No route contains domain behavior, no adapter defines policy, no configuration is read inside domain code, and no UI component owns state-transition semantics.
