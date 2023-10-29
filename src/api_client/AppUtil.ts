export class AppUtil {
  public uint8ArrayToBase64(uint8Array: Uint8Array): Promise<string> {
    return new Promise((resolve, reject) => {
      const blob = new Blob([uint8Array], { type: "application/octet-stream" });
      const reader = new FileReader();

      reader.onloadend = function () {
        if (!reader.result) {
          reject();
        }
        const base64data = (reader.result as string)?.split(",")[1];
        resolve(base64data);
      };

      reader.onerror = function (error) {
        reject(error);
      };

      reader.readAsDataURL(blob);
    });
  }
}
