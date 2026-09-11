import type { CreateExampleUseCase, ListExamplesUseCase } from "@/src/application";
import { presentExample } from "../presenters/example.presenter";
import { parseCreateExampleRequest } from "../schemas/create-example.request";

export interface ExamplesController {
  list(): Promise<Response>;
  create(request: Request): Promise<Response>;
}

export function createExamplesController(dependencies: {
  readonly createExample: CreateExampleUseCase;
  readonly listExamples: ListExamplesUseCase;
}): ExamplesController {
  return {
    async list() {
      const examples = await dependencies.listExamples();
      return Response.json({ data: examples.map(presentExample) });
    },
    async create(request) {
      const input = await parseCreateExampleRequest(request);
      if (!input.ok) return Response.json({ error: input.error }, { status: 400 });
      const result = await dependencies.createExample(input.value);
      if (!result.ok) return Response.json({ error: result.error }, { status: 422 });
      return Response.json({ data: presentExample(result.value) }, { status: 201 });
    },
  };
}
