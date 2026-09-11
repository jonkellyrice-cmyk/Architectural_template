import { createExamplesController } from "@/src/presentation/http";
import type { Application } from "./create-application";

export function createHttp(application: Application) {
  return {
    examples: createExamplesController({ createExample: application.createExample, listExamples: application.listExamples }),
  };
}

export type HttpSurface = ReturnType<typeof createHttp>;
