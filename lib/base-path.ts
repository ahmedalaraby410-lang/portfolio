const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function withBasePath(value: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return value;
  return `${basePath}${value}`;
}
