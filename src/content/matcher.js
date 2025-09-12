import { getFromStorage } from "./storage";

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

/**
 * Returns merged patterns: default + user-defined
 */
export async function getActivePatterns() {
  const { customPatterns } = await getFromStorage(["customPatterns"]);

  if (customPatterns && Object.keys(customPatterns).length > 0) {
    return customPatterns;
  }

  return defaultPatterns;
}

/**
 * Returns merged known domains
 */
export async function getActiveDomains() {
  const { customDomains } = await getFromStorage(["customDomains"]);

  if (Array.isArray(customDomains) && customDomains.length > 0) {
    return customDomains;
  }

  return defaultDomains;
}

/**
 * Checks text for sensitive matches using active (merged) patterns
 */
export async function containsSensitive(text) {
  const lower = text.toLowerCase();
  const patterns = await getActivePatterns();
  const matches = [];

  for (const category in patterns) {
    for (const pattern of patterns[category]) {
      try {
        if (category === "regex") {
          const regex = new RegExp(pattern, "gi");
          if (regex.test(text)) matches.push({ category, pattern });
        } else {
          if (lower.includes(pattern.toLowerCase())) matches.push({ category, pattern });
        }
      } catch (err) {
        console.warn("Invalid pattern skipped:", pattern);
      }
    }
  }

  return matches.length > 0 ? matches : null;
}