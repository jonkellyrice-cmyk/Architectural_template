import assert from "node:assert/strict";
import test from "node:test";

import { createCreateExampleUseCase } from "@/src/application";
import { createExampleNamePolicy } from "@/src/domain/examples";
import { createMemoryExampleRepository } from "@/src/infrastructure";

test("application orchestrates domain creation and persistence through ports", async () => {
  const repository = createMemoryExampleRepository();
  const events: unknown[] = [];
  const create = createCreateExampleUseCase({
    repository,
    clock: { nowIso: () => "2026-01-01T00:00:00.000Z" },
    ids: { next: () => "fixed-id" },
    telemetry: { record: (event) => events.push(event) },
    namePolicy: createExampleNamePolicy({ maxLength: 80 }),
  });

  const result = await create({ name: "Wired example" });

  assert.equal(result.ok, true);
  assert.equal((await repository.list()).length, 1);
  assert.equal(events.length, 1);
});
