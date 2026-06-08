const basePath = "";

export function withBasePath(value: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return value;
  return `${basePath}${value}`;
}
