/**
 * Converts a File object to a Base64-encoded string.
 * Optionally rejects files exceeding the specified size limit.
 *
 * @param file The file to convert
 * @param fileSize Optional maximum size (in MB)
 * @returns A Promise that resolves to a Base64 string
 */

export const fileToBase64 = (
  file: File,
  fileSize?: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // ✅ Optional size check
    if (fileSize) {
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > fileSize) {
        return reject(
          new Error(`File size exceeds the allowed limit of ${fileSize}MB.`)
        );
      }
    }

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
