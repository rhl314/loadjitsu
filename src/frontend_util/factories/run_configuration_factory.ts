import { RunConfiguration, RunShape } from "../ipc/run_document";

export class RunConfigurationFactory {
  public static newRunConfiguration(): RunConfiguration {
    const runConfiguration: RunConfiguration = {
      rps: 30,
      durationInSeconds: 30,
      shape: RunShape.CONSTANT,
    };
    return runConfiguration;
  }
}
