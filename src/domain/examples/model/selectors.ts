import type { ExampleState } from "./state";
import type { Example } from "./types";

export function selectExamples(state: ExampleState): readonly Example[] {
  return state.order.flatMap((id) => {
    const example = state.entities[id];
    return example ? [example] : [];
  });
}
