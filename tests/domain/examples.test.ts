import assert from "node:assert/strict";
import test from "node:test";

import { createExample, createExampleNamePolicy } from "@/src/domain/examples";

test("domain creation is deterministic for explicit inputs", () => {
  const policy = createExampleNamePolicy({ maxLength: 20 });
  const input = {
    id: "same-id",
    name: "  Same name  ",
    createdAt: "2026-01-01T00:00:00.000Z",
    namePolicy: policy,
  };
  const first = createExample(input);
  const second = createExample(input);

  assert.deepEqual(first, second);
  assert.equal(first.ok, true);
  if (first.ok) assert.equal(first.value.example.name, "Same name");
});

test("name policy rejects empty values", () => {
  const policy = createExampleNamePolicy({ maxLength: 20 });
  assert.equal(policy.parse("   ").ok, false);
});
