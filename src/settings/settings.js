const defaultDomains = [
  "chatgpt.com",
  "chat.openai.com",
  "bard.google.com",
  "gemini.google.com",
  "phind.com",
  "bing.com"
];

const defaultPatterns = {
  "keywords": ["api_key", "auth_token", "secret"],
  "regex": [
    "AKIA[0-9A-Z]{16}",
  ],
  "urls": ["https://api.myservice.com", "https://secure.example.com"],
  "vars": ["DB_PASSWORD", "JWT_SECRET", "API_TOKEN"],
  "configKeys": ["DATABASE_URL", "NEXTAUTH_SECRET"]
};

export function getFromStorage(keys) {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (data) => resolve(data));
  });
}

export function setToStorage(obj) {
  return new Promise((resolve) => {
    chrome.storage.local.set(obj, () => resolve());
  });
}

export function clearFromStorage(keys = []) {
  return new Promise((resolve) => {
    chrome.storage.local.remove(keys, () => {
      resolve(true);
    });
  });
}

const domainsField = document.getElementById("domains");
const patternsSection = document.getElementById("patterns-section");
const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");
const status = document.getElementById("status");

// 🧠 Load current or fallback defaults
async function loadSettings() {
  async function loadDefaults(fileName) {
    const res = await fetch(chrome.runtime.getURL(`config/${fileName}`));
    return await res.json();
  }
  const { customPatterns = null, customDomains = null } = await getFromStorage([
    "customPatterns",
    "customDomains",
  ]);

  const activePatterns =
    customPatterns && Object.keys(customPatterns).length > 0
      ? customPatterns
      : defaultPatterns;

  const activeDomains =
    customDomains && customDomains.length > 0 ? customDomains : defaultDomains;

  renderPatternInputs(activePatterns);
  domainsField.value = activeDomains.join(", ");
}

// 🧩 Render each key in pattern object
function renderPatternInputs(patterns) {
  patternsSection.innerHTML = "";

  for (const category of Object.keys(defaultPatterns)) {
    const label = document.createElement("label");
    label.innerHTML = `<strong>${category}</strong>`;

    const textarea = document.createElement("textarea");
    textarea.id = `pattern-${category}`;
    textarea.placeholder = `Comma-separated values for ${category}`;
    textarea.value = (patterns[category] || []).join(", ");

    patternsSection.appendChild(label);
    patternsSection.appendChild(textarea);
  }
}

// 💾 Save to Chrome storage
saveBtn.onclick = async () => {
  const customPatterns = {};
  const textareas = patternsSection.querySelectorAll("textarea");

  textareas.forEach((ta) => {
    const category = ta.id.replace("pattern-", "");
    const values = ta.value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    customPatterns[category] = values;
  });

  const customDomains = domainsField.value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  await setToStorage({ customPatterns, customDomains });

  status.textContent = "✅ Saved!";
  setTimeout(() => (status.textContent = ""), 2000);
};

// ♻️ Reset to Default
resetBtn.onclick = async () => {
  await clearFromStorage(["customPatterns", "customDomains"]);
  await loadSettings();
  status.textContent = "🔁 Reset to default values.";
  setTimeout(() => (status.textContent = ""), 2000);
};

// 🔃 Load on page open
loadSettings();
