import { clearCache } from './LocalStorage';
import { update } from './serviceWorker';

export async function forceReload(): Promise<void> {
  clearCache();
  await update();
  window.location.reload();
}
