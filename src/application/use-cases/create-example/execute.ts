import { createExample, type ExampleNamePolicy } from "@/src/domain/examples";

import type { Clock } from "../../ports/clock";
import type { ExampleRepository } from "../../ports/example-repository";
import type { IdGenerator } from "../../ports/id-generator";
import type { Telemetry } from "../../ports/telemetry";
import type { CreateExampleInput } from "./input";
import type { CreateExampleOutput } from "./output";

export type CreateExampleUseCase = (input: CreateExampleInput) => Promise<CreateExampleOutput>;

export function createCreateExampleUseCase(dependencies: {
  readonly repository: ExampleRepository;
  readonly clock: Clock;
  readonly ids: IdGenerator;
  readonly telemetry: Telemetry;
  readonly namePolicy: ExampleNamePolicy;
}): CreateExampleUseCase {
  return async (input) => {
    const created = createExample({
      id: dependencies.ids.next(),
      name: input.name,
      createdAt: dependencies.clock.nowIso(),
      namePolicy: dependencies.namePolicy,
    });
    if (!created.ok) return created;
    await dependencies.repository.save(created.value.example);
    dependencies.telemetry.record(created.value.event);
    return { ok: true, value: created.value.example };
  };
}
