import _ from "lodash";
import minimist from "minimist";
// import sh from "mvdan-sh";
import queryString from "query-string";
import shortid from "shortid";
import { Result } from "../common/Result";
import {
  ApiBodyFormData,
  ApiHeader,
  ApiStep,
  EnumApiBodyType,
  httpActionFromJSON,
} from "../ipc/api";
import { ApiStepFactory } from "./api_step_factory";

export class CurlParser {
  private payload: string;
  constructor(payload: string) {
    this.payload = payload;
  }
  public parse(): Result<ApiStep> {
    const apiStep = ApiStepFactory.new();
    try {
      // @ts-ignore
      const parser = window.sh.syntax.NewParser();

      const f = parser.Parse(this.payload, "curl.sh");
      const arr: string[] = [];
      // @ts-ignore
      window.sh.syntax.Walk(f, function (node: any) {
        if (node) {
          arr.push(node.Value as string);
        }
        return true;
      });
      console.log({ arr });
      const argv = minimist(_.compact(arr));
      let [command, url] = argv._;
      if (command !== "curl") {
        return Result.fail<ApiStep>({
          code: "ERROR_PARSING_CURL",
          message: "Please ensure curl command starts with curl",
        });
      }
      if (argv.location) {
        url = argv.location;
      }
      if (_.isEmpty(_.trim(url))) {
        return Result.fail<ApiStep>({
          code: "ERROR_PARSING_CURL",
          message: "Curl url not found",
        });
      }
      apiStep.endpoint = url;
      apiStep.action = httpActionFromJSON(
        (argv.request || "GET").toUpperCase()
      );

      for (const header of argv.header || argv.H || []) {
        const chunks = _.split(header, ":");
        const key = _.trim(chunks.shift());
        const value = chunks.join(":").trim();
        if (_.isEmpty(key)) {
          continue;
        }
        if (_.isEmpty(value)) {
          continue;
        }
        const apiHeader: ApiHeader = {
          uniqueId: shortid.generate(),
          active: true,
          deleted: false,
          key,
          value,
          description: "",
          validationErrors: [],
        };
        apiStep.headers.push(apiHeader);
      }

      let contentType = apiStep.headers.find((header) => {
        return header.key.toLowerCase() === "content-type";
      })?.value;

      const headerPriorities: Record<string, number> = {
        "content-type": 1,
        authorization: 2,
        cookie: 3,
      };
      apiStep.headers = _.sortBy(apiStep.headers, (header) => {
        return (
          headerPriorities[header.key.toLowerCase()] || Number.MAX_SAFE_INTEGER
        );
      });
      if (apiStep.body) {
        const rawData = _.trim(argv["data"] || argv["data-raw"] || "");
        let formData = argv["form"];
        if (_.isEmpty(formData)) {
          formData = [];
        } else if (!_.isArray(formData)) {
          formData = [formData];
        }
        let urlEncodedData = argv["data-urlencode"];
        if (_.isEmpty(urlEncodedData)) {
          urlEncodedData = [];
        } else if (!_.isArray(urlEncodedData)) {
          urlEncodedData = [urlEncodedData];
        }

        if (contentType === "application/x-www-form-urlencoded") {
          apiStep.body.type = EnumApiBodyType.X_URL_FORM_ENCODED;
          const parsedQueryString = queryString.parse(rawData);
          for (const key of _.keys(parsedQueryString)) {
            const value = _.trim(parsedQueryString[key] as string);
            const apiFormData: ApiBodyFormData = {
              uniqueId: shortid.generate(),
              key,
              value,
              description: "",
              active: true,
              deleted: false,
              validationErrors: [],
            };
            apiStep.body.formData.push(apiFormData);
          }
        } else if (!_.isEmpty(rawData)) {
          apiStep.body.type = EnumApiBodyType.TEXT;
          apiStep.body.data = rawData;
        } else if (!_.isEmpty(urlEncodedData)) {
          apiStep.body.type = EnumApiBodyType.X_URL_FORM_ENCODED;
          for (const rawFormData of urlEncodedData) {
            const parsedQueryString = queryString.parse(rawFormData);
            for (const key of _.keys(parsedQueryString)) {
              const value = _.trim(parsedQueryString[key] as string);
              const apiFormData: ApiBodyFormData = {
                uniqueId: shortid.generate(),
                key,
                value,
                description: "",
                active: true,
                deleted: false,
                validationErrors: [],
              };
              apiStep.body.formData.push(apiFormData);
            }
          }
        } else if (!_.isEmpty(formData)) {
          apiStep.body.type = EnumApiBodyType.FORM_DATA;
          for (const rawFormData of formData) {
            const parsedQueryString = queryString.parse(rawFormData);
            for (const key of _.keys(parsedQueryString)) {
              const value = _.trim(parsedQueryString[key] as string, '"');
              const apiFormData: ApiBodyFormData = {
                uniqueId: shortid.generate(),
                key,
                value,
                description: "",
                active: true,
                deleted: false,
                validationErrors: [],
              };
              apiStep.body.formData.push(apiFormData);
            }
          }
        } else {
          apiStep.body.type = EnumApiBodyType.EMPTY;
        }
      }
      return Result.ok<ApiStep>(apiStep);
    } catch (err: any) {
      return Result.fail<ApiStep>({
        code: "ERROR_PARSING_CURL",
        message: err.message,
      });
    }
  }
}
