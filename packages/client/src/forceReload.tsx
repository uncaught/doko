import {clearCache} from './LocalStorage';

export async function forceReload(): Promise<void> {
  clearCache();
  window.location.reload();
}
