/**
 * Universal Safe Storage Shim for BAZAR360
 * Prevents DOMException / SecurityError / QuotaExceededError in restricted iframe sandboxes.
 */

class MemoryStorage implements Storage {
  private store: Record<string, string> = {};

  get length(): number {
    return Object.keys(this.store).length;
  }

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }
}

function getSafeStorage(type: 'localStorage' | 'sessionStorage'): Storage {
  try {
    if (typeof window === 'undefined') {
      return new MemoryStorage();
    }
    const store = window[type];
    if (!store) return new MemoryStorage();
    const testKey = '__b360_probe__';
    store.setItem(testKey, '1');
    store.removeItem(testKey);
    return store;
  } catch {
    return new MemoryStorage();
  }
}

export const safeStorage = getSafeStorage('localStorage');
export const safeSessionStorage = getSafeStorage('sessionStorage');

export function safeGetItem(key: string, fallback: string | null = null): string | null {
  try {
    return safeStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

export function safeSetItem(key: string, value: string): boolean {
  try {
    safeStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function safeRemoveItem(key: string): boolean {
  try {
    safeStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
