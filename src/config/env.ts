import { DEFAULT_APP_NAME, DEFAULT_EXAMPLE_NAME_MAX_LENGTH } from "./defaults";
import { parsePositiveInteger, type AppConfig } from "./schema";

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return {
    appName: env.APP_NAME?.trim() || DEFAULT_APP_NAME,
    exampleNameMaxLength: parsePositiveInteger(env.EXAMPLE_NAME_MAX_LENGTH, DEFAULT_EXAMPLE_NAME_MAX_LENGTH),
  };
}
