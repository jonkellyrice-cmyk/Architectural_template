import { loadConfig } from "@/src/config";
import { createApplication } from "./create-application";
import { createHttp } from "./create-http";

const config = loadConfig();
const application = createApplication(config);
const http = createHttp(application);

export const runtime = Object.freeze({ config, application, http });
