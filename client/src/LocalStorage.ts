const prefix = 'doko:';

export function get<T>(key: string, defaultVal: any = null): T | null {
  let parsed = defaultVal;
  const storeValue = localStorage.getItem(prefix + key);
  if (storeValue !== null) {
    try {
      parsed = JSON.parse(storeValue);
    } catch (e) {
      console.error(e);
    }
  }
  return parsed;
}

export function set<T>(key: string, value: T): void {
  localStorage.setItem(prefix + key, JSON.stringify(value));
}
