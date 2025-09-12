export function redactText(text, matches) {
  let redacted = text;

  for (const { category, pattern } of matches) {
    try {
      const regex = category === "regex"
        ? new RegExp(pattern, "gi")
        : new RegExp(escapeRegExp(pattern), "gi");

      redacted = redacted.replace(regex, "****");
    } catch (err) {
      console.warn("Redact error:", pattern);
    }
  }

  return redacted;
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
