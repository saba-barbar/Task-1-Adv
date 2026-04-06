# Library Management System

A client-side Library Management System built with TypeScript, HTML, and CSS. Demonstrates OOP principles including Encapsulation, Inheritance, Polymorphism, and Abstraction — no external libraries.

## Features

- Display books as cards (title, author, category, availability)
- Search by title or author
- Filter by category
- Toggle book availability (Check Out / Return)

## OOP Concepts Applied

| Concept | Implementation |
|---|---|
| Encapsulation | Private fields (`#`) in `Book` and `Library` |
| Inheritance | `ReferenceBook extends Book` |
| Polymorphism | `displayInfo()` overridden in `ReferenceBook` |
| Abstraction | `Library` exposes a clean API; internals are hidden |

## Project Structure

```
library-management/
├── index.html
├── tsconfig.json
├── README.md
├── css/
│   └── style.css
└── src/
    └── ts/
        └── main.ts
    
```
