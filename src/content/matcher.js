import { getFromStorage } from "./storage";

const defaultDomains = ['safepaste-game-flo.vercel.app'];

const defaultPatterns = {
  "keywords": [],
  "regex": [],
  "urls": [],
  "vars": [],
  "configKeys": []
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