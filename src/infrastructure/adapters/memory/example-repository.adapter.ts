import type { ExampleRepository } from "@/src/application";
import {
  createInitialExampleState,
  reduceExampleState,
  selectExamples,
  type Example,
  type ExampleState,
} from "@/src/domain/examples";

export function createMemoryExampleRepository(): ExampleRepository {
  let state: ExampleState = createInitialExampleState();
  return {
    async list() { return selectExamples(state); },
    async save(example: Example) {
      state = reduceExampleState(state, { type: "example/stored", example });
    },
  };
}
