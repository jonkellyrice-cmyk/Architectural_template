import type { Example } from "./types";

export type ExampleAction = {
  readonly type: "example/stored";
  readonly example: Example;
};
