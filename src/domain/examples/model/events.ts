import type { ExampleId } from "./types";

export interface ExampleCreatedEvent {
  readonly type: "example/created";
  readonly exampleId: ExampleId;
  readonly occurredAt: string;
}
