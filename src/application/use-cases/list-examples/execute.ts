import type { Example } from "@/src/domain/examples";
import type { ExampleRepository } from "../../ports/example-repository";

export type ListExamplesUseCase = () => Promise<readonly Example[]>;

export function createListExamplesUseCase(dependencies: { readonly repository: ExampleRepository }): ListExamplesUseCase {
  return () => dependencies.repository.list();
}
