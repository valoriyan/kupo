import { isServer } from "./isServer";

/**
 * A factory function for creating a type-safe wrapper around storage providers
 * that implement the Web Storage API interface that `window.localStorage` and
 * `window.sessionStorage` implement.
 */
export const storageFactory = (
  getStorageProvider: () => Storage,
  options?: {
    /**
     * If `.setItem` fails due the storage quota being exceeded,
     * this function will be called
     */
    onSetItemError?: (key: string, value: string) => void;
    /**
     * If `.setItem` fails due the storage quota being exceeded
     * even after clearing storage, this function will be called
     */
    onSetItemAfterClearError?: (key: string, value: string) => void;
  },
) => {
  const StorageSingleton = {
    getItem: <T extends unknown>(
      key: string,
      reviver?: (this: unknown, key: string, value: unknown) => unknown,
    ): T | null => {
      if (isServer()) return null;
      const strItem = getStorageProvider().getItem(key);
      if (!strItem) {
        return null;
      }
      return JSON.parse(strItem, reviver) as T;
    },

    setItem: <T extends unknown>(
      key: string,
      value: T,
      replacer?: (this: unknown, key: string, value: unknown) => unknown,
    ): void => {
      if (isServer()) return;
      const strItem = JSON.stringify(value, replacer);
      try {
        getStorageProvider().setItem(key, strItem);
      } catch {
        getStorageProvider().clear();
        options?.onSetItemError
          ? options.onSetItemError(key, strItem)
          : console.warn("Storage has been cleared due to exceeding its quota", { key });
        try {
          getStorageProvider().setItem(key, strItem);
        } catch {
          // Despite clearing storage, this item is too big to store. Give up...
          options?.onSetItemAfterClearError
            ? options.onSetItemAfterClearError(key, strItem)
            : console.error(`Failed to store ${key}`, { key, strItem });
        }
      }
    },

    removeItem: (key: string): void => {
      if (isServer()) return;
      getStorageProvider().removeItem(key);
    },

    clear: (): void => {
      if (isServer()) return;
      getStorageProvider().clear();
    },

    keys: (): string[] => {
      if (isServer()) return [];
      return Object.keys(getStorageProvider());
    },
  };

  const StorageItem = function <T extends unknown>(
    name: string,
    options?: {
      reviver?: (this: unknown, key: string, value: unknown) => unknown;
      replacer?: (this: unknown, key: string, value: unknown) => unknown;
    },
  ) {
    return {
      get: () => StorageSingleton.getItem<T>(name, options?.reviver),
      set: (value: T) => StorageSingleton.setItem(name, value, options?.replacer),
      remove: () => StorageSingleton.removeItem(name),
    };
  };

  return [StorageSingleton, StorageItem] as const;
};

export const [LocalStorage, LocalStorageItem] = storageFactory(() => window.localStorage);
export const [SessionStorage, SessionStorageItem] = storageFactory(
  () => window.sessionStorage,
);
