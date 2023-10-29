import { RunDocument, RunType } from "../ipc/run_document";
import { ApiStepFactory } from "./api_step_factory";
import { RunConfigurationFactory } from "./run_configuration_factory";

const curlPayload = `
curl --location --request POST 'http://localhost:3000/api/members/organisation-id/BqJQhBTDrh100gqwYM0I' \
--header 'authority: staging.plumhq.com' \
--header 'pragma: no-cache' \
--header 'cache-control: no-cache' \
--header 'sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"' \
--header 'sec-ch-ua-mobile: ?0' \
--header 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36' \
--header 'sentry-trace: 5476fb8975bd46398a763b18caa74f1e-922745baecfbff95-1' \
--header 'sec-ch-ua-platform: "macOS"' \
--header 'accept: */*' \
--header 'sec-fetch-dest: empty' \
--header 'sec-fetch-site: same-origin' \
--header 'sec-fetch-mode: cors' \
--header 'referer: https://staging.plumhq.com/manage-members' \
--header 'accept-language: en-GB,en-US;q=0.9,en;q=0.8' \
--header 'cookie: _fbp=fb.1.1633329439558.1762990158; SL_C_23361dd035530_VID=mG85mqyE2L; SL_C_23361dd035530_KEY=68758f39546798d8834a67fa8aadfb06c05b9c03; intercom-id-vxjp8okv=6446066a-ff1b-461d-ab3c-d3dcb82d48be; G_ENABLED_IDPS=google; _ga=GA1.2.673424074.1633439344; hubspotutk=1d329ce021519f1dd916a22455330a6c; ajs_user_id=dAN9oBuwyUu4oznlaDsH; _cioid=dAN9oBuwyUu4oznlaDsH; ajs_anonymous_id=d817ae76-b472-4f30-a36e-8bceebb1c26d; isPlumUser=true; amplitude_idundefinedplumhq.com=eyJvcHRPdXQiOmZhbHNlLCJzZXNzaW9uSWQiOm51bGwsImxhc3RFdmVudFRpbWUiOm51bGwsImV2ZW50SWQiOjAsImlkZW50aWZ5SWQiOjAsInNlcXVlbmNlTnVtYmVyIjowfQ==; __hssrc=1; amplitude_id_0baeb9d55857dfad7fb1dccb40ebd9eaplumhq.com=eyJkZXZpY2VJZCI6ImMyOTllMDM3LWMxNzMtNGNlYS04MDhiLWNlZmU0ZmJhOTc4Y1IiLCJ1c2VySWQiOiJkQU45b0J1d3lVdTRvem5sYURzSCIsIm9wdE91dCI6ZmFsc2UsInNlc3Npb25JZCI6MTYzOTU2MzA2Mjg3MCwibGFzdEV2ZW50VGltZSI6MTYzOTU2MzA2Mjg3MiwiZXZlbnRJZCI6Mjg0LCJpZGVudGlmeUlkIjoxNjYsInNlcXVlbmNlTnVtYmVyIjo0NTB9; _clck=1vo789v|1|exb|0; __adroll_fpc=e869b3f0b161fa2b1e2f9acbbfb4d9c2-1639640395957; __ar_v4=%7COMH2LLNI2NDMHNNW5OK2WY%3A20220015%3A1%7CSJ5HEOELZVGJDCIEW2IOBA%3A20220015%3A1; _gcl_au=1.1.1366589726.1641268434; intercom-session-vxjp8okv=; SL_C_23361dd035530_SID=w3fb7K_8V-; __hstc=94753923.1d329ce021519f1dd916a22455330a6c.1633439344385.1639640397064.1641280276369.31; session=eyJhbGciOiJSUzI1NiIsImtpZCI6InRCME0yQSJ9.eyJpc3MiOiJodHRwczovL3Nlc3Npb24uZmlyZWJhc2UuZ29vZ2xlLmNvbS9wbHVtLTY2M2RkIiwiYXVkIjoicGx1bS02NjNkZCIsImF1dGhfdGltZSI6MTY0MTI5ODI0OSwidXNlcl9pZCI6Im1PMFkzZGxTUTJSaUI5QlRuTVRiRmVhT04zdjEiLCJzdWIiOiJtTzBZM2RsU1EyUmlCOUJUbk1UYkZlYU9OM3YxIiwiaWF0IjoxNjQxMjk4MjUwLCJleHAiOjE2NDE3MzAyNTAsImVtYWlsIjoiZ2F1cmF2K2FkbWluQHBsdW1ocS5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJnYXVyYXYrYWRtaW5AcGx1bWhxLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.KzrHfO6begvKGc-_8ZmGXzXCeqsD4OW3So0JfVzyX5PzKmqmgUHeHX5SNR37aiEg2sHu-3gb5BgD4siVqjnGN137e9FPaEDWIaYGmX0Br8EmZ8ljJs5K8IiZFv7pR0Fy2fsuIIzGgKNP1HXePgSp61PHRL3AJQ36cqmwNa6mCIh-4-a_CSW-HYYrJN6FOKPPghEHN0su3UDuakQpL-wJLqOmPnwIfwNCMqUmMYhtOOeeYja5-nbzPwDtu7Da-86H24fKpPUBsGaFFkektxOkUkE-UoYSEiy118A1840i2SMH4bDDj2DbtlLkwPzQqlXwzeLPw5UojTX7YPluKUH8kw' \
--header 'Content-Type: text/html' \
--data-raw '{
    "hello": "world"
}'
`


export class RunDocumentFactory {
    public static newRunDocument(type: RunType, uniqueId: string): RunDocument {
        const runDocument: RunDocument = {
            uniqueId,
            title: "Untitled load test",
            type,
            configuration: RunConfigurationFactory.newRunConfiguration(),
            apiSteps: [],
        }
        if (type === RunType.API) {
            //runDocument.apiSteps = [ApiStepFactory.fromCurl(curlPayload).getValue()]
            runDocument.apiSteps = [ApiStepFactory.new()]
        }
        return runDocument;
    }
}