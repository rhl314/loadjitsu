import { StreamLanguage } from "@codemirror/language";
import { shell } from "@codemirror/legacy-modes/mode/shell";
import CodeMirror from "@uiw/react-codemirror";
import React, { useLayoutEffect, useRef, useState } from "react";

const CodeEditor = (props: {
  text: string;
  setText: (text: string) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [editorHeight, setEditorHeight] = useState<number>(100);
  const onChange = React.useCallback((val: any, viewUpdate: any) => {
    console.log("val:", val);
    props.setText(val);
  }, []);
  useLayoutEffect(() => {
    const height = ref.current?.getBoundingClientRect()?.height || 0;
    setEditorHeight(height);
  }, []);

  return (
    <div className="h-full" ref={ref}>
      <CodeMirror
        className="h-full"
        height={`${editorHeight}px`}
        value={props.text}
        extensions={[StreamLanguage.define(shell)]}
        onChange={onChange}
      />
    </div>
  );
};

export default CodeEditor;
