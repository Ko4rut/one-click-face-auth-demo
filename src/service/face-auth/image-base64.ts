const DATA_URL_PREFIX = /^data:image\/[a-zA-Z0-9.+-]+;base64,/;

export function stripImageDataUrlPrefix(dataUrl: string): string {
  return dataUrl.replace(DATA_URL_PREFIX, "");
}
