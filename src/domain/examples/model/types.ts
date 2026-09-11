import type { Brand } from "@/src/kernel";

export type ExampleId = Brand<string, "ExampleId">;
export type ExampleName = Brand<string, "ExampleName">;

export interface Example {
  readonly id: ExampleId;
  readonly name: ExampleName;
  readonly createdAt: string;
}

export interface ExampleDomainError {
  readonly code: "INVALID_EXAMPLE_NAME";
  readonly message: string;
}
