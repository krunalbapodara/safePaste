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