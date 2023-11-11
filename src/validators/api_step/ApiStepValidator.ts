import validUrl from "valid-url";
import { Result } from "../../frontend_util/common/Result";
import { ApiStep } from "../../frontend_util/ipc/api";

export class ApiStepValidator {
  private apiStep: ApiStep;
  constructor(apiStep: ApiStep) {
    this.apiStep = apiStep;
  }

  validateTimeout(): boolean {
    if (isNaN(this.apiStep.timeoutInMs)) {
      this.apiStep.validationErrors.push({
        field: "timeoutInMs",
        message: "Timeout must be a number",
      });
    } else if (this.apiStep.timeoutInMs < 0) {
      this.apiStep.validationErrors.push({
        field: "timeoutInMs",
        message: "Timeout must be a positive number",
      });
      return false;
    } else if (this.apiStep.timeoutInMs > 60000) {
      this.apiStep.validationErrors.push({
        field: "timeoutInMs",
        message: "Timeout must be less than 60 seconds",
      });
      return false;
    }
    return true;
  }
  validateUrl(): boolean {
    if (validUrl.isUri(this.apiStep.endpoint)) {
      return true;
    } else {
      this.apiStep.validationErrors.push({
        field: "endpoint",
        message: "Endpoint must be a valid URL",
      });
      return false;
    }
  }

  resetErrors(): void {
    this.apiStep.validationErrors = [];
  }

  public validate(): Result<{ valid: boolean; apiStep: ApiStep }> {
    try {
      this.resetErrors();
      let valid = +this.validateUrl() & +this.validateTimeout() ? true : false;
      return Result.ok({ valid, apiStep: this.apiStep });
    } catch (err) {
      return Result.fail({
        code: "UNHANDLED_ERROR_DURING_VALIDATION",
        message: (err as Error)?.message,
      });
    }
  }
}
