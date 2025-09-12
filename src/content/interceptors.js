import { containsSensitive } from './matcher';
import { showModal } from './modal';
import { findActiveInputField } from './utils';

let lastSensitiveText = "";
let lastActiveInput = null;

function insertTextManually(field, text) {
  if (!field) return;

  if (typeof field.value !== "undefined") {
    const start = field.selectionStart || 0;
    const end = field.selectionEnd || 0;
    field.value = field.value.slice(0, start) + text + field.value.slice(end);
    field.selectionStart = field.selectionEnd = start + text.length;
    field.dispatchEvent(new Event("input", { bubbles: true }));
  } else if (field.isContentEditable) {
    field.focus();
    document.execCommand("insertText", false, text);
  }
}

// ========== NAMED HANDLERS ==========

function handlePaste(event) {
  const text = (event.clipboardData || window.clipboardData).getData("text");

  event.preventDefault();
  event.stopImmediatePropagation();

  lastActiveInput = findActiveInputField();

  containsSensitive(text).then(matches => {
    if (!matches) {
      insertTextManually(lastActiveInput, text);
      return;
    }

    lastSensitiveText = text;
    showModal(text, matches, lastActiveInput);
  });
}

function handleKeydown(event) {
  if (event.key !== "Enter" || event.shiftKey) return;

  const input = document.activeElement;
  const text = input?.value || input?.innerText || "";

  containsSensitive(text).then(matches => {
    if (!matches) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    lastSensitiveText = text;
    lastActiveInput = input;
    showModal(text, matches, input);
  });
}

function handleClick(event) {
  const target = event.target;
  if (target?.tagName !== "BUTTON" && target?.type !== "submit") return;

  const input = findActiveInputField();
  if (!input) return;

  const text = input.value || input.innerText || "";

  containsSensitive(text).then(matches => {
    if (!matches) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    lastSensitiveText = text;
    lastActiveInput = input;
    showModal(text, matches, input);
  });
}

// ========== SETUP ==========

export function setupPasteInterceptor() {
  document.addEventListener("paste", handlePaste, true);
}

export function setupEnterInterceptor() {
  document.addEventListener("keydown", handleKeydown, true);
}

export function setupClickInterceptor() {
  document.addEventListener("click", handleClick, true);
}

// ========== CLEANUP ==========

export function cleanupInterceptors() {
  document.removeEventListener("paste", handlePaste, true);
  document.removeEventListener("keydown", handleKeydown, true);
  document.removeEventListener("click", handleClick, true);
}

window.addEventListener("beforeunload", cleanupInterceptors);
