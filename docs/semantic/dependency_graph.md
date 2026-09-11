# Time Calculator - Dependency Graph

## Purpose

Define allowed dependency relationships for the MVP.

This graph describes:

- import dependencies
- runtime dependencies
- ownership boundaries
- allowed dependency directions

---

# High-Level Graph

layout.tsx
    ↓
page.tsx
    ↓
feature.tsx
    ↓ (runtime HTTP request)
api/premium/route.ts

---

# Dependency Types

## Import Dependency

A file directly imports another file.

Example:

page.tsx
    imports
feature.tsx

---

## Runtime Dependency

A file communicates with another system through an API call.

Example:

feature.tsx
    fetch()
/api/premium

No direct import exists.

---

# File Dependency Graph

src/app/layout.tsx

Responsibilities:

- application wrapper
- metadata
- global styling

Dependencies:

- none

May Import:

- global styles
- providers

May NOT Import:

- feature.tsx
- premium route

---

src/app/page.tsx

Responsibilities:

- root page entrypoint
- mount application feature

Dependencies:

- feature.tsx

May Import:

- AppFeature

May NOT Import:

- route.ts

---

src/app_feature/feature.tsx

Responsibilities:

- UI
- state
- calculations
- result rendering

Dependencies:

- browser APIs
- React APIs

Runtime Dependencies:

- /api/premium

May Import:

- React

May NOT Import:

- page.tsx
- layout.tsx
- route.ts

Communication with route.ts must occur through fetch().

---

src/app/api/premium/route.ts

Responsibilities:

- premium capability endpoint
- future payment checks
- future premium features

Dependencies:

- Next.js server APIs

May Import:

- server utilities

May NOT Import:

- feature.tsx
- page.tsx
- layout.tsx

---

# Allowed Dependency Matrix

layout.tsx
    -> page.tsx

page.tsx
    -> feature.tsx

feature.tsx
    -> React

feature.tsx
    -> /api/premium (runtime only)

route.ts
    -> server-side utilities

---

# Forbidden Dependencies

feature.tsx
    -> route.ts (direct import)

route.ts
    -> feature.tsx

route.ts
    -> page.tsx

route.ts
    -> layout.tsx

page.tsx
    -> route.ts

---

# Ownership

layout.tsx owns:

- application shell

page.tsx owns:

- root page entry

feature.tsx owns:

- calculator UI
- calculator state
- calculator logic

route.ts owns:

- premium endpoint

---

# Future Expansion

Optional future dependencies:

feature.tsx
    -> data/*

feature.tsx
    -> storage/*

feature.tsx
    -> lib/*

These dependencies do not exist in MVP.

---

# Validation Rules

1. No circular dependencies.
2. page.tsx imports AppFeature.
3. AppFeature renders successfully.
4. Premium communication occurs through HTTP only.
5. route.ts never imports UI files.

