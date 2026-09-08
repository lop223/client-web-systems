interface ILibraryItem {
  name: string;
  author: string;
  borrowed: boolean;

  borrow(): void;
  info(): void;
}

abstract class LibraryItem implements ILibraryItem {
  public name: string;
  public author: string;
  private _borrowed: boolean = false;

  constructor(name: string, author: string) {
    this.name = name;
    this.author = author;
  }

  public get borrowed() {
    return this._borrowed;
  }

  borrow(): void {
    this._borrowed = true;
  }

  abstract info(): void;
}

class Book extends LibraryItem {
  constructor(
    name: string,
    author: string,
    public pageCount: number
  ) {
    super(name, author);
  }

  info(): void {
    console.log(
      `{${this.name} - ${this.author}} | Page count: ${this.pageCount} | (${this.borrowed ? 'borrowed' : 'available'})`
    );
  }
}

class Magazine extends LibraryItem {
  constructor(
    name: string,
    author: string,
    public seriesNumber: number
  ) {
    super(name, author);
  }

  info(): void {
    console.log(
      `{${this.name} - ${this.author}} | Series number: ${this.seriesNumber} | (${this.borrowed ? 'borrowed' : 'available'})`
    );
  }
}

class DVD extends LibraryItem {
  constructor(
    name: string,
    author: string,
    public duration: number
  ) {
    super(name, author);
  }

  info(): void {
    console.log(
      `{${this.name} - ${this.author}} | Duration: ${this.duration} | (${this.borrowed ? 'borrowed' : 'available'})`
    );
  }
}

class Library {
  private _items: Array<ILibraryItem> = [];

  public get items(): Array<ILibraryItem> {
    return [...this._items];
  }

  private _normalize(str: string): string {
    return str.trim().toLocaleLowerCase();
  }

  public findByName(name: string): ILibraryItem | undefined {
    return this._items.find(
      (item) => this._normalize(item.name) === this._normalize(name)
    );
  }

  public add(item: ILibraryItem): void {
    if (this.findByName(item.name))
      throw new Error(`This item '${item.name} already exist.'`);
    this._items.push(item);
  }

  public remove(name: string): boolean {
    const targetName = this._normalize(name);
    const lengthOnStart = this._items.length;
    this._items = this._items.filter(
      (item) => this._normalize(item.name) !== targetName
    );

    return this._items.length < lengthOnStart;
  }
}

const library = new Library();

const book = new Book('Kobzar', 'Taras Shevchenko', 280);
const magazine = new Magazine('National Geographic', 'Editorial', 104);
const dvd = new DVD('Inception', 'Christopher Nolan', 148);

library.add(book);
library.add(magazine);
library.add(dvd);

book.borrow();

library.items.forEach((item) => item.info());