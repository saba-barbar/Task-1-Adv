
class Book {
  #title: string;
  #author: string;
  #category: string;
  #isAvailable: boolean;
  type = "book";

  constructor(title: string, author: string, category: string) {
    this.#title = title;
    this.#author = author;
    this.#category = category;
    this.#isAvailable = true;
  }

  setTitle(title: string): void {
    this.#title = title
  }
  getTitle(): string {
    return this.#title
  }
  setAuthor(author: string): void {
    this.#author = author
  }
  getAuthor(): string {
    return this.#author
  }
  setCategory(category: string): void {
    this.#category = category
  }
  getCategory(): string {
    return this.#category
  }
  setIsAvailable(isAvailable: boolean): void {
    this.#isAvailable = isAvailable
  }
  getAvailable(): boolean {
    return this.#isAvailable
  }
  toggleAvailability(): void {
    this.#isAvailable = !this.#isAvailable;
  }

  displayInfo(): string {
    return `${this.#title} by ${this.#author} [${this.#category}] — ${this.#isAvailable ? "Available" : "Unavailable"}`;
  }
}

class ReferenceBook extends Book {
  #locationCode: string;
  type = "reference";

  constructor(title: string, author: string, category: string, locationCode: string) {
    super(title, author, category);
    this.#locationCode = locationCode;
  }

  getLocationCode(): string {
    return this.#locationCode;
  }
  setAuthor(locationCode: string): void {
    this.#locationCode = locationCode
  }

  displayInfo(): string {
    return `${super.displayInfo()} | Location: ${this.#locationCode}`;
  }
}

class Library {
  #books: Book[] = [];

  addBook(book: Book): void {
    this.#books. push(book);
  }

  removeBook(title: string): void {
    this.#books = this.#books.filter(b => b.getTitle() !== title);
  }

  searchBooks(query: string): Book[] {
    const q = query. toLowerCase();
    if (!q ) return  [...this.#books];
    return this.#books.filter(b =>
      b.getTitle().toLowerCase().includes(q) ||  b.getAuthor().toLowerCase().includes(q)
    );
  }

  filterByCategory(category:  string): Book[] {
    if (category === "All") return [...this.#books];
    return this.#books.filter(b => b.getCategory() === category);
  }

  toggleAvailability(title: string): void {
    const book = this.#books.find(b => b.getTitle() === title);
    if (book) book.toggleAvailability();
  }

  getAllBooks(): Book[] {
    return [...this.#books];
  }

  getCategories(): string[] {
    return ["All", ...new Set(this.#books.map(b => b.getCategory()))];
  }
}
const library = new Library();

library.addBook(new Book("1984", "George Orwell", "Fiction"));
library.addBook(new Book("Brave New World", "Aldous Huxley", "Fiction"));
library.addBook(new Book("A Brief History of Time", "Stephen Hawking", "Science"));
library.addBook(new Book("The Selfish Gene", "Richard Dawkins", "Science"));
library.addBook(new Book("Sapiens", "Yuval Noah Harari", "History"));
library.addBook(new Book("The Art of War", "Sun Tzu", "History"));
library.addBook(new ReferenceBook("Oxford English Dictionary", "Oxford Press", "Reference", "A1-S3"));
library.addBook(new ReferenceBook("Encyclopedia Britannica", "Britannica", "Reference", "B2-S1"));
library.addBook(new Book("Clean Code", "Robert C. Martin", "Technology"));
library.addBook(new Book("The Pragmatic Programmer", "David Thomas", "Technology"));

const grid = document.getElementById("booksGrid") as HTMLDivElement;
const searchInput = document.getElementById("searchInput") as HTMLInputElement;
const categoryFilter = document.getElementById("categoryFilter") as HTMLSelectElement;
const totalCount = document.getElementById("totalCount") as HTMLSpanElement;

function renderBooks(books: Book[]): void {
  if (books.length === 0)  return;

  grid.innerHTML = books.map(book => {
    const available = book.getAvailable();
    const isRef = book.type === "reference";
    const locationCode = isRef ? (book as ReferenceBook).getLocationCode() : null;

    return `
      <div class="book-card ${available ? "available" : "unavailable"}">
        <div class="card-header">
          <h3 class="book-title">${book.getTitle()}</h3>
          <p class="book-author">${book.getAuthor()}</p>
          <span class="category-badge">${book.getCategory()}</span>
          ${isRef ? `<span class="ref-badge">Reference</span>` : ""}
        </div>
        ${locationCode ? `<p class="location-code">loaction: ${locationCode}</p>` : ""}
        <div class="card-footer">
          <span class="status-badge ${available ? "status-available" : "status-unavailable"}">
            ${available ? "Available" : "Unavailable"}
          </span>
          <button class="toggle-btn" onclick="toggleBook('${book.getTitle().replace(/'/g, "\\'")}')">
            ${available ? "Check Out" : "Return"}
          </button>
        </div>
      </div>`;
  }).join("");
}
function getFilteredBooks(): Book[] {
  const query = searchInput.value;
  const category = categoryFilter.value;
  let books = library.searchBooks(query);
  if (category !== "All") {
    books = books.filter(b => b.getCategory() === category);
  }
  return books;
}

(window as any).toggleBook = (title: string): void => {
  library.toggleAvailability(title);
  renderBooks(getFilteredBooks());
};

searchInput.addEventListener("input", () => renderBooks(getFilteredBooks()));
categoryFilter.addEventListener("change", () => renderBooks(getFilteredBooks()));

renderBooks(library.getAllBooks());
