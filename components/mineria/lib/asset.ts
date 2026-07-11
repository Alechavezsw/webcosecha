export function asset(path: string): string {
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  if (normalized.startsWith("mineria/")) {
    return `/${normalized}`;
  }
  return `/mineria/${normalized}`;
}
