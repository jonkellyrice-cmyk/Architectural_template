import { createCreateExampleUseCase, createListExamplesUseCase } from "@/src/application";
import type { AppConfig } from "@/src/config";
import { createExampleNamePolicy } from "@/src/domain/examples";
import { consoleTelemetry, createMemoryExampleRepository, cryptoIdGenerator, systemClock } from "@/src/infrastructure";

export function createApplication(config: AppConfig) {
  const repository = createMemoryExampleRepository();
  const namePolicy = createExampleNamePolicy({ maxLength: config.exampleNameMaxLength });
  return {
    createExample: createCreateExampleUseCase({ repository, clock: systemClock, ids: cryptoIdGenerator, telemetry: consoleTelemetry, namePolicy }),
    listExamples: createListExamplesUseCase({ repository }),
  };
}

export type Application = ReturnType<typeof createApplication>;
