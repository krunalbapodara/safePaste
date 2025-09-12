import { redactText } from './redact';

export function showModal(content, matches, targetInput) {
  removeExistingModal();

  const modal = document.createElement("div");
  modal.id = "safePasteModal";
  modal.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #0d1117;
    color: white;
    border: 1px solid #333;
    border-radius: 10px;
    padding: 20px;
    z-index: 2147483647;
    width: 400px;
    box-shadow: 0 0 20px rgba(255,255,255,0.2);
    font-family: 'Segoe UI', sans-serif;
  `;

  modal.innerHTML = `
    <h2 style="margin-top:0;">🚨 Sensitive Content Detected</h2>
    <p style="font-size:14px; max-height:120px; overflow-y:auto;">
      "${content.slice(0, 100)}${content.length > 100 ? '...' : ''}"
    </p>
    <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: flex-end;">
      <button id="sp-cancel-btn" type="button" style="${btnStyle('#555', '#eee')}">Cancel</button>
      <button id="sp-redact-btn" type="button" style="${btnStyle('#ff9800', '#000')}">Redact & Paste</button>
      <button id="sp-proceed-btn" type="button" style="${btnStyle('#4caf50', '#000')}">Paste Anyway</button>
    </div>
  `;

  document.body.appendChild(modal);

  // Attach safe click handlers
  const cancelBtn = document.getElementById("sp-cancel-btn");
  const redactBtn = document.getElementById("sp-redact-btn");
  const proceedBtn = document.getElementById("sp-proceed-btn");

  if (cancelBtn) {
    cancelBtn.addEventListener("click", removeExistingModal);
  }

  if (redactBtn) {
    redactBtn.addEventListener("click", () => {
      insertText(targetInput, redactText(content, matches));
      removeExistingModal();
    });
  }

  if (proceedBtn) {
    proceedBtn.addEventListener("click", () => {
      insertText(targetInput, content);
      removeExistingModal();
    });
  }
}

function insertText(field, text) {
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

function removeExistingModal() {
  const modal = document.getElementById("safePasteModal");
  if (modal) modal.remove();
}

function btnStyle(bg, color) {
  return `
    padding: 6px 12px;
    background: ${bg};
    color: ${color};
    border: none;
    border-radius: 5px;
    cursor: pointer;
  `;
}
