import type { ExampleState } from "./state";
import type { Example } from "./types";

export function selectExamples(state: ExampleState): readonly Example[] {
  return state.order.map((id) => state.entities[id]).filter(Boolean);
}
