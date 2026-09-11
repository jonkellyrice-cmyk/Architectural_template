import type { Telemetry } from "@/src/application";

export const consoleTelemetry: Telemetry = {
  record(event) { console.info("[telemetry]", event); },
};
