const settingsPrefix = 'doko:v1.4:';
let cachePrefix = 'cache:0:';
let loguxPrefix = 'logux:0';

export function getLoguxPrefix(): string {
  return loguxPrefix;
}

export function clearCache(): void {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i) || '';
    if (key.startsWith('logux:') || key.startsWith('cache:')) {
      localStorage.removeItem(key);
    }
  }
}

export function setBuildTime(buildTime: number): void {
  cachePrefix = `cache:${buildTime}:`;
  loguxPrefix = `logux:${buildTime}`;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i) || '';
    if (
      (key.startsWith('cache:') && !key.startsWith(cachePrefix)) ||
      (key.startsWith('logux:') && !key.startsWith(loguxPrefix))
    ) {
      localStorage.removeItem(key);
    }
  }
}

function get<T>(key: string, defaultVal: T): T {
  let parsed = defaultVal;
  const storeValue = localStorage.getItem(key);
  if (storeValue !== null) {
    try {
      parsed = JSON.parse(storeValue);
    } catch (e) {
      console.error(e);
    }
  }
  return parsed;
}

function set<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getCached<T>(key: string, defaultVal: T): T {
  return get(cachePrefix + key, defaultVal);
}

export function setCached<T>(key: string, value: T): void {
  set(cachePrefix + key, value);
}

export function getSetting<T>(key: string, defaultVal: T): T {
  return get(settingsPrefix + key, defaultVal);
}

export function setSetting<T>(key: string, value: T): void {
  set(settingsPrefix + key, value);
}
