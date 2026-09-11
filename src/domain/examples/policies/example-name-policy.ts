import { err, ok, type Result } from "@/src/kernel";

import type { ExampleDomainError, ExampleName } from "../model/types";

export interface ExampleNamePolicy {
  parse(value: string): Result<ExampleName, ExampleDomainError>;
}

export function createExampleNamePolicy(options: { readonly maxLength: number }): ExampleNamePolicy {
  return {
    parse(value) {
      const normalized = value.trim();
      if (normalized.length === 0 || normalized.length > options.maxLength) {
        return err({
          code: "INVALID_EXAMPLE_NAME",
          message: `Example name must contain 1-${options.maxLength} characters.`,
        });
      }
      return ok(normalized as ExampleName);
    },
  };
}
