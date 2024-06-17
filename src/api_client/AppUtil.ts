export class AppUtil {
  public static fixBase64Padding(base64String: string): string {
    // Calculate the length of the base64 string without padding
    const missingPadding = 4 - (base64String.length % 4);

    // Add the required padding characters '='
    if (missingPadding !== 4) {
      base64String += "=".repeat(missingPadding);
    }

    return base64String;
  }
  public uint8ArrayToBase64(uint8Array: Uint8Array): Promise<string> {
    return new Promise((resolve, reject) => {
      const blob = new Blob([uint8Array], { type: "application/octet-stream" });
      const reader = new FileReader();

      reader.onloadend = function () {
        if (!reader.result) {
          reject();
        }
        const base64data = (reader.result as string)?.split(",")[1];
        resolve(AppUtil.fixBase64Padding(base64data));
      };

      reader.onerror = function (error) {
        reject(error);
      };

      reader.readAsDataURL(blob);
    });
  }
  public base64ToUint8Array(base64: string): Uint8Array {
    console.log(base64);
    return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  }
}
