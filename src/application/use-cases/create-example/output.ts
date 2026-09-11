import type { Example, ExampleDomainError } from "@/src/domain/examples";
import type { Result } from "@/src/kernel";

export type CreateExampleOutput = Result<Example, ExampleDomainError>;
