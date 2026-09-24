/** Мінімальний контракт, якого має дотримуватись елемент колекції Library<T>. */
export interface Identifiable {
  id: string;
}

/**
 * Generic-клас для управління колекцією об'єктів довільного типу T
 * (за умови, що T має унікальний id). Використовується і для книг, і для користувачів —
 * саме тому Library узагальнений, а не написаний окремо під кожен тип.
 */
export class Library<T extends Identifiable> {
  private items: T[];

  constructor(initialItems: T[] = []) {
    this.items = [...initialItems];
  }

  add(item: T): void {
    this.items.push(item);
  }

  remove(id: string): boolean {
    const initialLength = this.items.length;
    this.items = this.items.filter((item) => item.id !== id);
    return this.items.length !== initialLength;
  }

  findById(id: string): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  find(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate);
  }

  getAll(): T[] {
    return [...this.items];
  }

  count(): number {
    return this.items.length;
  }
}
