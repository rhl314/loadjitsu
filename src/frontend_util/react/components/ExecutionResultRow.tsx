import * as _ from "lodash";

export default function ExecutionResultRow(props: { data: any }) {
  let status: string = "NONE";
  const output = [];
  for (const row of props.data.rows) {
    if (row.DataKey === "STATUS") {
      status = row.StringValue;
    } else {
      const header = row.DataKey;
      let value = null;
      if (row.DataType === "STRING") {
        value = row.StringValue;
      } else if (row.DataType === "FLOAT") {
        value = row.FloatValue.toString();
      } else if (row.DataType === "INTEGER") {
        value = row.IntValue.toString();
      }
      output.push(`${_.startCase(header.toLowerCase())}:${value}`);
    }
  }
  let borderType = "";
  if (status === "SUCCESS") {
    borderType = "success";
  } else if (status === "TIMEOUT") {
    borderType = "warning";
  } else {
    borderType = "danger";
  }

  return <p className={`text-${borderType}`}>{output.join(", ")}</p>;
}
