import type { Clock } from "@/src/application";

export const systemClock: Clock = {
  nowIso() { return new Date().toISOString(); },
};
