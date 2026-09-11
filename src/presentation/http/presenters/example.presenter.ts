import type { Example } from "@/src/domain/examples";

export interface ExampleView {
  readonly id: string;
  readonly name: string;
  readonly createdAt: string;
}

export function presentExample(example: Example): ExampleView {
  return { id: example.id, name: example.name, createdAt: example.createdAt };
}
