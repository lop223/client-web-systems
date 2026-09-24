/** Генерує унікальний ідентифікатор на основі часової мітки (лише цифри). */
export function generateId(): string {
  return Date.now().toString();
}
