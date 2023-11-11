import JSTimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import _ from "lodash";
import { useCallback, useContext, useEffect, useState } from "react";
import { RunDocumentAppContext } from "../../RunDocumentContext";

JSTimeAgo.addDefaultLocale(en);

export default function RunNavigation() {
  const { state, dispatch } = useContext(RunDocumentAppContext);
  const [lastSavedAt, setLastSavedAt] = useState(new Date());
  const [queueSave, setQueueSave] = useState(0);

  const save = async () => {
    /*if (_.isNil(state.runDocument)) {
      return;
    }
    const bytes = RunDocument.encode(state.runDocument).finish();
    const serialized = Buffer.from(bytes).toString("base64");
    const apiClient = new ApiClient();
    try {
      await apiClient.save(serialized);
      setLastSavedAt(new Date());
    } catch (err) {
      console.error(err);
    }*/
  };
  const saveCallback = useCallback(save, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      save();
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [state]);
  if (_.isNil(state.runDocument)) {
    return <div />;
  }
  return (
    <>
      <div className="app_container mx-auto">
        <article className="prose prose-lg my-4">
          <h2>
            <input
              type="text"
              className="fs-4 w-full"
              value={state.runDocument.title}
              onChange={(event: any) => {
                (state.runDocument.title = event?.target?.value),
                  dispatch({
                    runDocument: {
                      ...state.runDocument,
                    },
                  });
              }}
              style={{ backgroundColor: "transparent", border: "none" }}
            />
          </h2>
        </article>
      </div>
    </>
  );
}
