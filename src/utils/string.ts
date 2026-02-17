export function truncateText(text: string, limit: number, suffix = "…") {
  if (!text) return "";
  if (text.length <= limit) return text;

  return text.slice(0, limit).trimEnd() + suffix;
}

export function isBlank(value: string | null | undefined): boolean {
  return !value?.trim();
}
