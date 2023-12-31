// @ts-ignore
import shortid from "shortid";
import { Result } from "../common/Result";
import {
  ApiBody,
  ApiStep,
  EnumApiBodyType,
  HttpAction,
  HttpAuthType,
} from "../ipc/api";
import { CurlParser } from "./CurlParser";

export class ApiBodyFactory {
  public static new(): ApiBody {
    const apiBody: ApiBody = {
      type: EnumApiBodyType.EMPTY,
      contentType: "application/json",
      data: "",
      formData: [],
    };
    return apiBody;
  }
}

export class ApiStepFactory {
  public static new(): ApiStep {
    const apiStep: ApiStep = {
      uniqueId: shortid.generate(),
      endpoint: "",
      action: HttpAction.GET,
      timeoutInMs: 5000,
      body: ApiBodyFactory.new(),
      headers: [],
      validationErrors: [],
      authType: HttpAuthType.NONE_AUTH,
      authBasic: undefined,
    };
    return apiStep;
  }

  public static fromCurl(curlString: string): Result<ApiStep> {
    try {
      const curlParser = new CurlParser(curlString);
      return curlParser.parse();
    } catch (err: any) {
      return Result.fail<ApiStep>({
        code: "ERROR_PARSING_CURL",
        message: err.message,
      });
    }
  }
}
