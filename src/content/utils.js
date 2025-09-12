export function findActiveInputField() {
  const el = document.activeElement;
  if (el && (el.tagName === "TEXTAREA" || el.tagName === "INPUT" || el.isContentEditable)) {
    return el;
  }
  return document.querySelector("textarea, input[type='text'], [contenteditable='true']");
}
