# 📐 Ghanaian SHS Interactive Math Learning Platform

A full-stack, interactive educational web application designed specifically for Senior High School (SHS) mathematics students in Ghana. Built with modern web technologies and precision mathematical typesetting to support independent problem-solving and concept mastery.

---

## 🚀 Features & Capabilities

* **Curriculum-Aligned Practice:** Covers core SHS mathematics modules including Algebra, Trigonometry, Geometry, Statistics, Indices, Logarithms, and Probability.
* **Flawless Mathematical Typesetting:** Integrated with **MathJax** to render complex equations, fractions, and mathematical notations seamlessly across questions and step-by-step solution breakdowns.
* **Instant Validation & Ergonomics:** Provides immediate correct/incorrect feedback with automated smooth-scrolling that guides students straight to detailed solution breakdowns.
* **Performance Dashboard:** Real-time summary analytics tracking overall scores and topic-specific accuracy breakdowns.

---

## 🛠️ Tech Stack

* **Frontend:** Dynamic HTML5, CSS3, and JavaScript with MathJax rendering engine.
* **Backend:** Node.js, Express.js REST API routes.
* **Database & ORM:** SQLite powered by Prisma ORM for robust schema management and data seeding.
* **Version Control & Release Workflow:** Semantic versioning (`v1.1.0`), feature branching, and pull request-driven deployment on GitHub.

---

## 📂 Project Architecture

```text
math-learning-platform/
├── prisma/
│   └── schema.prisma      # Database schema definitions
├── public/
│   └── index.html         # Frontend UI, quiz renderer, and client-side logic
├── server.js              # Express backend server and API endpoints
├── seed.js                # Database seeder for curriculum modules
├── package.json           # Dependencies and project scripts
└── README.md              # Project documentation