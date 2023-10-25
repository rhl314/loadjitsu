use serde::{Deserialize, Serialize};
#[derive(Serialize, Deserialize)]
pub struct IHttpApi {
    uniqueId: String,
    //method: EnumHttpMethod;
    //url: string;
    //timeoutMs: number;
    //variables: IRunVariable[];
}
