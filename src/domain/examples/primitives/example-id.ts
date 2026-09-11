import type { ExampleId } from "../model/types";

export function toExampleId(value: string): ExampleId {
  if (value.length === 0) throw new Error("Example IDs must not be empty.");
  return value as ExampleId;
}
