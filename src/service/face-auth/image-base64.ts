const DATA_URL_PREFIX = /^data:image\/[a-zA-Z0-9.+-]+;base64,/;

export function stripImageDataUrlPrefix(dataUrl: string): string {
  return dataUrl.replace(DATA_URL_PREFIX, "");
}

export function imageDataUrlToBlob(dataUrl: string): Blob {
  const [metadata, encodedData] = dataUrl.split(",");

  if (!metadata || !encodedData || !metadata.includes(";base64")) {
    throw new Error("Image data URL không hợp lệ.");
  }

  const mimeMatch = metadata.match(/^data:([^;]+);base64$/);
  const mimeType = mimeMatch?.[1] ?? "image/jpeg";
  const binary = window.atob(encodedData);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: mimeType });
}
