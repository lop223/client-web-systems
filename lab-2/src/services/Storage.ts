/**
 * Обгортка над LocalStorage: зберігання, завантаження, видалення та очищення.
 * Не знає нічого про моделі чи DOM — просто працює з ключами/JSON.
 */
export class Storage {
  static save<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      // LocalStorage може бути недоступним (приватний режим) або переповненим.
      console.error(`Storage: не вдалося зберегти дані за ключем "${key}"`, error);
    }
  }

  static load<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch (error) {
      console.error(`Storage: не вдалося завантажити дані за ключем "${key}"`, error);
      return null;
    }
  }

  static remove(key: string): void {
    localStorage.removeItem(key);
  }

  static clear(): void {
    localStorage.clear();
  }
}
