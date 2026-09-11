import { randomUUID } from "node:crypto";
import type { IdGenerator } from "@/src/application";

export const cryptoIdGenerator: IdGenerator = {
  next() { return randomUUID(); },
};
