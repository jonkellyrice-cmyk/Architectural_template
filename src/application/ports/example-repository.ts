import type { Example } from "@/src/domain/examples";

export interface ExampleRepository {
  list(): Promise<readonly Example[]>;
  save(example: Example): Promise<void>;
}
