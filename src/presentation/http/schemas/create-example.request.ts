import type { CreateExampleInput } from "@/src/application";
import { err, ok, type Result } from "@/src/kernel";

export interface BadRequestError {
  readonly code: "BAD_REQUEST";
  readonly message: string;
}

export async function parseCreateExampleRequest(request: Request): Promise<Result<CreateExampleInput, BadRequestError>> {
  let body: unknown;
  try { body = await request.json(); } catch {
    return err({ code: "BAD_REQUEST", message: "Request body must be valid JSON." });
  }
  if (typeof body !== "object" || body === null || !("name" in body) || typeof body.name !== "string") {
    return err({ code: "BAD_REQUEST", message: "Request body must contain a string field named name." });
  }
  return ok({ name: body.name });
}
