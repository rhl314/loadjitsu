import { RunType } from "../../ipc/run_document";
import HttpSvg from "../../../assets/svg/http.svg"


export default function TestIcon(props: { type: RunType}) {
    switch(props.type) {
        case RunType.API:
            return <HttpSvg/>
        default: 
            return null;
    }
}