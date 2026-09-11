import { ok, type Result } from "@/src/kernel";

import type { ExampleCreatedEvent } from "../model/events";
import type { Example, ExampleDomainError } from "../model/types";
import type { ExampleNamePolicy } from "../policies/example-name-policy";
import { toExampleId } from "./example-id";

export interface CreatedExample {
  readonly example: Example;
  readonly event: ExampleCreatedEvent;
}

export function createExample(input: {
  readonly id: string;
  readonly name: string;
  readonly createdAt: string;
  readonly namePolicy: ExampleNamePolicy;
}): Result<CreatedExample, ExampleDomainError> {
  const name = input.namePolicy.parse(input.name);
  if (!name.ok) return name;

  const example: Example = {
    id: toExampleId(input.id),
    name: name.value,
    createdAt: input.createdAt,
  };

  return ok({
    example,
    event: { type: "example/created", exampleId: example.id, occurredAt: input.createdAt },
  });
}
