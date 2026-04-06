class Book {
    #title;
    #author;
    #category;
    #isAvailable;

    constructor(title, author, category) {
        this.#title = title;
        this.#author = author;
        this.#category = category;
        this.#isAvailable = true;
    }

    getTitle()    { return this.#title; }
    getAuthor()   { return this.#author; }
    getCategory() { return this.#category; }
    isAvailable() { 
        return this.#isAvailable; 
    }

    toggleAvailability() {
        this.#isAvailable = !this.#isAvailable;
    }

    displayInfo() {
        return `${this.#title} by ${this.#author} [${this.#category}] — ${this.#isAvailable ? "Available" : "Unavailable"}`;
    }
}

class ReferenceBook extends Book {
    #locationCode;

    constructor(title, author, category, locationCode) {
        super(title, author, category);
        this.#locationCode = locationCode;
    }

    getLocationCode() { return this.#locationCode; }

    displayInfo() {
        return `${super.displayInfo()} | Location: ${this.#locationCode}`;
    }
}

class Library {
    #books = [];

    addBook(book)         { this.#books.push(book); }
    removeBook(title)     { this.#books = this.#books.filter(b => b.getTitle() !== title); }
    getAllBooks()          { return [...this.#books]; }

    searchBooks(query) {
        const q = query.toLowerCase().trim();
        if (!q) return [...this.#books];
        return this.#books.filter(b =>
            b.getTitle().toLowerCase().includes(q) ||
            b.getAuthor().toLowerCase().includes(q)
        );
    }

    filterByCategory(category) {
        if (category === "All") return [...this.#books];
        return this.#books.filter(b => b.getCategory() === category);
    }

    toggleAvailability(title) {
        const book = this.#books.find(b => b.getTitle() === title);
        if (book) book.toggleAvailability();
    }

    getCategories() {
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

const grid           = document.getElementById("booksGrid");
const searchInput    = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const totalCount     = document.getElementById("totalCount");

function renderBooks(books) {
    if (books.length === 0) { return;
    }

    grid.innerHTML = books.map(book => {
        const available    = book.isAvailable();
        const isRef        = book instanceof ReferenceBook;
        const locationCode = isRef ? book.getLocationCode() : null;

        return `
            <div class="book-card ${available ? "available" : "unavailable"}">
                <h3 class="book-title">${book.getTitle()}</h3>
                <p class="book-author">${book.getAuthor()}</p>
                <div class="card-header">
                    <span class="category-badge">${book.getCategory()}</span>
                    ${isRef ? `<span class="ref-badge">Reference</span>` : ""}
                </div>
                ${locationCode ? `<p class="location-code">location:  ${locationCode}</p>` : ""}
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
function getFilteredBooks() {
    const query    = searchInput.value;
    const category = categoryFilter.value;
    let books      = library.searchBooks(query);
    if (category !== "All") {
        books = books.filter(b => b.getCategory() === category);
    }
    return books;
}

window.toggleBook = (title) => {
    library.toggleAvailability(title);
    renderBooks(getFilteredBooks());
};

searchInput.addEventListener("input",    () => renderBooks(getFilteredBooks()));
categoryFilter.addEventListener("change", () => renderBooks(getFilteredBooks()));

renderBooks(library.getAllBooks());
