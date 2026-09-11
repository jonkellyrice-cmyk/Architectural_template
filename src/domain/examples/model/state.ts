import type { ExampleAction } from "./actions";
import type { Example, ExampleId } from "./types";

export interface ExampleState {
  readonly entities: Readonly<Record<string, Example>>;
  readonly order: readonly ExampleId[];
}

export function createInitialExampleState(): ExampleState {
  return { entities: {}, order: [] };
}

export function reduceExampleState(state: ExampleState, action: ExampleAction): ExampleState {
  switch (action.type) {
    case "example/stored":
      return {
        entities: { ...state.entities, [action.example.id]: action.example },
        order: state.entities[action.example.id] ? state.order : [...state.order, action.example.id],
      };
  }
}
