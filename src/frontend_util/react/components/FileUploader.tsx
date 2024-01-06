import React, { ChangeEvent, useRef, useState } from "react";
import { Result } from "../../common/Result";

const convertBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};
interface IFileUploadState {
  status: "SUCCESS" | "ERROR" | "UPLOADING" | "IDLE";
  error?: string;
  fileAsbase64?: string;
}

const FileUploader = (props: {
  allowedContentTypes: string[];
  sizeLimtInKiloBytes: number;
  uploadFile: (fileAsbase64: string) => Promise<Result<void>>;
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<IFileUploadState>({
    status: "IDLE",
  });

  const handleFilePicker = async (
    e: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const { files } = e.target;

    if (files != null && files.length > 0) {
      const fileObject = {
        file: files[0],
        dataUrl: URL.createObjectURL(files[0]),
      };
      if (!props.allowedContentTypes.includes(fileObject.file.type)) {
        return;
      }
      if (fileObject.file.size > props.sizeLimtInKiloBytes * 1024) {
        setState({
          status: "ERROR",
          error: `Please select an image file smaller than ${props.sizeLimtInKiloBytes} kb`,
        });

        return;
      }
      setState({
        status: "UPLOADING",
        error: undefined,
      });
      const base64 = await convertBase64(fileObject.file);
      setState({
        status: "UPLOADING",
        error: undefined,
        fileAsbase64: base64 as string,
      });
      try {
        await props.uploadFile(base64 as string);
        setState({
          status: "SUCCESS",
          error: undefined,
          fileAsbase64: base64 as string,
        });
      } catch (error) {
        setState({
          status: "ERROR",
          error: (error as Error)?.message,
        });
      }
    }
  };
  return (
    <>
      <button
        onClick={() => {
          ref.current?.click();
        }}
        type="button"
        className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        Change
      </button>
      {state.error && <p>{state.error}</p>}

      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={ref}
        onChange={(e) => handleFilePicker(e)}
      />
    </>
  );
};

export default FileUploader;
