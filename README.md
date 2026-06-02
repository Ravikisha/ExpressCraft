<img src="https://ravikisha.github.io/assets/ExpressCraftLogo.png" alt="ExpressCraft" object-fit="contain">

ExpressCraft is a command-line tool that allows you to quickly generate an Express application scaffold, getting you up and running with a basic Express server structure in no time.
<div align="center" style="display: flex; justify-content: start; gap: 1rem;flex-wrap: wrap;">
  <img src="https://img.shields.io/npm/v/expresscraft" alt="Version">
  <img src="https://img.shields.io/github/last-commit/ravikisha/expresscraft" alt="Last Commit">
  <img src="https://img.shields.io/github/languages/code-size/ravikisha/expresscraft" alt="Code Size">
  <img src="https://img.shields.io/github/languages/top/ravikisha/expresscraft" alt="Language">
  <img src="https://img.shields.io/github/license/ravikisha/expresscraft" alt="License">
  <img src="https://img.shields.io/github/issues/ravikisha/expresscraft" alt="Issues">
  <img src="https://img.shields.io/github/forks/ravikisha/expresscraft" alt="Forks">
  <img src="https://img.shields.io/github/stars/ravikisha/expresscraft" alt="Stars">
  <img src="https://img.shields.io/github/issues-pr/ravikisha/expresscraft" alt="Pull Requests">
  </div>


## Installation

ExpressCraft needs **Node.js >= 16**. Install it globally with your package manager of choice:

```bash
npm install -g expresscraft
# or
yarn global add expresscraft
# or
pnpm add -g expresscraft
```

Or run it without installing:

```bash
npx expresscraft
```

## Usage

Run the tool and answer the prompts:

```bash
npx expresscraft
```

You'll be asked for project metadata (name, description, author) and can either pick a **preset** or fully **customize** every choice. ExpressCraft then:

1. Collects all your answers.
2. Builds a single `package.json` from them.
3. Generates a structured project (see [Generated Project Structure](#generated-project-structure)).
4. Runs **one** dependency install at the end (npm / yarn / pnpm).

### Non-interactive mode

Pass flags to skip the prompts — handy for scripting and CI:

```bash
expresscraft my-api --preset api --yes
expresscraft --name blog --preset mvc --pm pnpm --yes
```

### CLI options

| Flag | Description |
| ---- | ----------- |
| `-n, --name <name>` | Project name |
| `-p, --preset <name>` | Preset: `minimal` \| `api` \| `mvc` \| `fullstack` |
| `--pm <manager>` | Package manager: `npm` \| `yarn` \| `pnpm` |
| `--ts` / `--js` | Language (TypeScript / JavaScript) |
| `-y, --yes` | Non-interactive (use preset/flag defaults) |
| `-f, --force` | Overwrite an existing folder without asking |
| `--docker` | Add Dockerfile + docker-compose |
| `--ci` | Add a GitHub Actions workflow |
| `--hooks` | Add Husky + lint-staged pre-commit |
| `--logger` | Add a pino HTTP logger |
| `-h, --help` | Show help |

### Add to an existing project

Already have an Express app? Run `expresscraft add` **inside it** to layer on features without touching your source files:

```bash
cd my-existing-app
expresscraft add                                   # interactive picker
expresscraft add --db postgresql --orm prisma --yes
expresscraft add --auth jwt --testing jest --dry-run
```

It detects your package manager (from the lockfile) and language (TypeScript/JavaScript), then:

- **Merges** new dependencies and scripts into your `package.json` (your existing versions/scripts win; a `package.json.bak` backup is written).
- **Writes only new files** — existing files are skipped with a warning (`--force` to overwrite).
- **Appends** any missing keys to `.env` / `.env.example`.
- Writes **`EXPRESSCRAFT_SETUP.md`** with the exact imports/middleware/bootstrap lines to paste into your app (ExpressCraft never edits your source).
- Runs a single install at the end.

Use `--dry-run` to preview every change without writing anything.

**Auto-wiring (`--inject`)**: instead of only printing instructions, ExpressCraft can insert the safe parts directly into your entry file (the one with `const app = express()`):

```bash
expresscraft add --auth passport --inject --yes
```

- Inserts new **imports** after your last import/require and **middleware** (`app.use`/`app.set`) after your last existing one — matching your actual app variable name.
- Backs the file up to `<file>.bak`, skips lines already present (idempotent), and **falls back to the guide** if it can't confidently locate the app.
- **Bootstrap lines** (e.g. `await connectDB()`) are never injected — they need an async context — so they stay in `EXPRESSCRAFT_SETUP.md` for you to place.

### Presets

| Preset | Language | PM | Stack |
| ------ | -------- | -- | ----- |
| `minimal` | JavaScript | npm | Express base only |
| `api` | TypeScript | npm | PostgreSQL + Prisma, Jest, JWT, ESLint, Swagger |
| `mvc` | JavaScript | npm | EJS + Bootstrap + Sass, MongoDB + Mongoose, Jest, Passport, ESLint |
| `fullstack` | TypeScript | pnpm | EJS + Tailwind + Sass, PostgreSQL + Prisma, Jest, JWT, ESLint, Swagger |

> `api` adds CI + Husky + logger; `fullstack` adds Docker + CI + Husky + logger on top.

## Features

- **Presets or full customization** of every choice
- **Interactive prompts** or **non-interactive flags** (CI-friendly)
- Builds one `package.json` from your choices, then a **single install** at the end
- **Pinned dependency versions** for reproducible installs
- Generates a **real project structure** (routes, middleware, config, `.env`)
- Working **database/auth boilerplate**, not just installed packages
- Baseline middleware out of the box: **helmet, cors, morgan**, JSON parsing, error handler, `/health` route
- Optional **extras**: Docker, GitHub Actions CI, Husky + lint-staged, pino logger
- Overwrite protection + rollback if generation fails
- Update notifier — tells you when a newer ExpressCraft is available

## Modules and Frameworks
ExpressCraft supports the following modules and frameworks:

### Package Manager
| Package Manager | Description |
| --------------- | ----------- |
|![NPM](https://img.shields.io/npm/v/npm.svg?logo=npm)| NPM is the default package manager for the JavaScript runtime environment Node.js.|
|![Yarn](https://img.shields.io/npm/v/yarn.svg?logo=yarn)| Yarn is a package manager for your code. It allows you to use and share code with other developers from around the world.|
|![pnpm](https://img.shields.io/badge/pnpm-9-orange.svg?logo=pnpm)| pnpm is a fast, disk-space-efficient package manager that uses a content-addressable store.|

### Language
| Language | Description |
| -------- | ----------- |
|![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow.svg?logo=javascript)| JavaScript is a programming language that conforms to the ECMAScript specification.|
|![TypeScript](https://img.shields.io/badge/TypeScript-4.4.3-blue.svg?logo=typescript)| TypeScript is a superset of JavaScript that compiles to plain JavaScript.|

### Version Control
| Version Control | Description |
| --------------- | ----------- |
|![Git](https://img.shields.io/badge/Git-2.33.0-red.svg?logo=git)| Git is a distributed version control system for tracking changes in source code during software development.|
|![SVN](https://img.shields.io/badge/SVN-1.14.0-blue.svg?logo=Subversion)| Apache Subversion is a software versioning and revision control system distributed as open source under the Apache License.|

### Template Engine
| Template Engine | Description |
| --------------- | ----------- |
|![EJS](https://img.shields.io/badge/EJS-3.1.6-red.svg?logo=ejs)| EJS is a simple templating language that lets you generate HTML markup with plain JavaScript.|
|![Pug](https://img.shields.io/badge/Pug-3.0.2-green.svg?logo=pug)| Pug is a high-performance template engine heavily influenced by Haml and implemented with JavaScript for Node.js and browsers.|
|![Twig](https://img.shields.io/badge/Twig-3.3.2-blue.svg?logo=twig)| Twig is a modern template engine for PHP.|
|![Handlebars](https://img.shields.io/badge/Handlebars-4.7.7-yellow.svg?logo=handlebars)| Handlebars provides the power necessary to let you build semantic templates effectively with no frustration.|

### CSS Framework

| CSS Framework | Description |
| ------------- | ----------- |
|![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-2.2.16-blue.svg?logo=tailwind-css)| Tailwind CSS is a utility-first CSS framework for rapidly building custom designs.|
|![Bootstrap](https://img.shields.io/badge/Bootstrap-5.1.1-purple.svg?logo=bootstrap)| Bootstrap is an open-source front-end framework for developing websites and web applications.|
|![Bulma](https://img.shields.io/badge/Bulma-0.9.3-red.svg?logo=bulma)| Bulma is a free, open-source CSS framework based on Flexbox and used by more than 200,000 developers.|
|![Foundation](https://img.shields.io/badge/Foundation-6.6.3-blue.svg?logo=foundation)| Foundation is a family of responsive front-end frameworks that make it easy to design beautiful responsive websites, apps, and emails.|
|![Materialize](https://img.shields.io/badge/Materialize-1.0.0-blue.svg?logo=materialize)| Materialize is a modern responsive front-end framework based on Material Design.|
|![Semantic UI](https://img.shields.io/badge/Semantic%20UI-2.9-blue.svg?logo=semantic-ui)| Semantic UI (Fomantic UI fork) helps create beautiful, responsive layouts using human-friendly HTML.|

> Tailwind uses the v4 CSS-first workflow (`@import "tailwindcss";` + `@tailwindcss/cli`).

### CSS Preprocessor

| CSS Preprocessor | Description |
| ---------------- | ----------- |
|![Sass](https://img.shields.io/badge/Sass-1.77-pink.svg?logo=sass)| Sass (Dart Sass). ExpressCraft ships a compiler script (`lib/sass_compiler.js`) that builds `styles/**/*.scss` into `public/css`.|
|![Less](https://img.shields.io/badge/Less-4.2-blue.svg?logo=less)| Less is a backwards-compatible language extension for CSS.|
|![Stylus](https://img.shields.io/badge/Stylus-0.63-green.svg?logo=stylus)| Stylus is an expressive, dynamic, robust CSS preprocessor.|
|![PostCSS](https://img.shields.io/badge/PostCSS-8.4-red.svg?logo=postcss)| PostCSS is a tool for transforming CSS with JavaScript plugins.|

### Database

| Database | Description |
| -------- | ----------- |
|![MySQL](https://img.shields.io/badge/MySQL-8.0.26-blue.svg?logo=mysql)| MySQL is an open-source relational database management system.|
|![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13.4-blue.svg?logo=postgresql)| PostgreSQL is a powerful, open-source object-relational database system.|
|![SQLite](https://img.shields.io/badge/SQLite-3.36.0-blue.svg?logo=sqlite)| SQLite is a C-language library that implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine.|
|![MongoDB](https://img.shields.io/badge/MongoDB-5.1.1-blue.svg?logo=mongodb)| MongoDB is a general-purpose, document-based, distributed database built for modern application developers and for the cloud era.|

### ORM

| ORM | Description |
| --- | ----------- |
|![Prisma](https://img.shields.io/badge/Prisma-3.0.1-blue.svg?logo=prisma)| Prisma is an open-source database toolkit. It replaces traditional ORMs and makes database access easy with an auto-generated query builder for TypeScript & Node.js.|
|![Sequelize](https://img.shields.io/badge/Sequelize-6.6.5-blue.svg?logo=sequelize)| Sequelize is a promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite, and Microsoft SQL Server.|
|![TypeORM](https://img.shields.io/badge/TypeORM-0.2.38-blue.svg?logo=typeorm)| TypeORM is an ORM that can run in NodeJS, Browser, Cordova, PhoneGap, Ionic, React Native, NativeScript, Expo, and Electron platforms and can be used with TypeScript and JavaScript.|
|![Mongoose](https://img.shields.io/badge/Mongoose-6.0.8-blue.svg?logo=mongoose)| Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.|
|![Drizzle](https://img.shields.io/badge/Drizzle-0.30-green.svg?logo=drizzle)| Drizzle is a lightweight, type-safe TypeScript ORM with a SQL-like query API for Node.js.|

### Testing

| Testing | Description |
| ------- | ----------- |
|![Jest](https://img.shields.io/badge/Jest-27.2.4-blue.svg?logo=jest)| Jest is a delightful JavaScript Testing Framework with a focus on simplicity.|
|![Mocha](https://img.shields.io/badge/Mocha-9.0.0-blue.svg?logo=mocha) ![Chai](https://img.shields.io/badge/Chai-4.3.4-blue.svg?logo=chai)| Mocha is a feature-rich JavaScript test framework running on Node.js and in the browser, making asynchronous testing simple and fun.|
|![Jasmine](https://img.shields.io/badge/Jasmine-3.9.0-blue.svg?logo=jasmine)| Jasmine is a behavior-driven development framework for testing JavaScript code.|

### Authentication

| Authentication | Description |
| -------------- | ----------- |
|![Passport.js](https://img.shields.io/badge/Passport.js-0.4.1-blue.svg?logo=passport)| Passport is authentication middleware for Node.js. Extremely flexible and modular, Passport can be unobtrusively dropped into any Express-based web application.|
|![JWT](https://img.shields.io/badge/JWT-8.5.1-blue.svg?logo=json-web-tokens)| JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties.|

### Linting

| Linting | Description |
| ------- | ----------- |
|![ESLint](https://img.shields.io/badge/ESLint-7.32.0-blue.svg?logo=eslint)| ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.|
|![TSLint](https://img.shields.io/badge/TSLint-deprecated-lightgrey.svg?logo=tslint)| TSLint is deprecated — selecting it now generates an ESLint setup instead.|

### API Documentation

| API Documentation | Description |
| ----------------- | ----------- |
|![Swagger](https://img.shields.io/badge/Swagger-3.0.0-blue.svg?logo=swagger)| Swagger is a set of open-source tools built around the OpenAPI Specification that can help you design, build, document, and consume REST APIs.|
|![Postman](https://img.shields.io/badge/Postman-8.10.0-blue?logo=postman)| Postman is a collaboration platform for API development.|

### Extras

Optional add-ons (interactive checkbox, `--docker/--ci/--hooks/--logger` flags, or via a preset):

| Extra | What you get |
| ----- | ------------ |
|![Docker](https://img.shields.io/badge/Docker-blue.svg?logo=docker)| `Dockerfile`, `.dockerignore`, and a `docker-compose.yml` (with a matching DB service when a database is selected).|
|![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-CI-blue.svg?logo=githubactions)| A `ci.yml` workflow that installs deps and runs your lint/test/build scripts (only the ones that exist).|
|![Husky](https://img.shields.io/badge/Husky-+%20lint--staged-green.svg?logo=git)| A `pre-commit` hook running lint-staged (Prettier), installed automatically via the `prepare` script.|
|![pino](https://img.shields.io/badge/pino-logger-green.svg?logo=pino)| `pino` + `pino-http` structured request logging wired into the app, with `pino-pretty` for dev.|

## Getting Started

Run ExpressCraft and answer the prompts (or pass flags):

```bash
npx expresscraft
```

Example session:

```text
  _____                               ____            __ _
 | ____|_  ___ __  _ __ ___  ___ ___ / ___|_ __ __ _ / _| |_
 |  _| \ \/ / '_ \| '__/ _ \/ __/ __| |   | '__/ _` | |_| __|
 | |___ >  <| |_) | | |  __/\__ \__ \ |___| | | (_| |  _| |_
 |_____/_/\_\ .__/|_|  \___||___/___/\____|_|  \__,_|_|  \__|
            |_|

✨ ExpressCraft v1.4.0 — Express.js generator ✨

? What is your project name? ecommerce
? Project description? (optional) Ecommerce API
? Project author? (optional) Ravi Kishan
? Start from a preset, or customize? Preset: api

📋 Project summary:
-----------------------------------
  Name               ecommerce
  Language           typescript
  Package manager    npm
  Version control    git
  Template engine    no template engine
  CSS framework      no css framework
  CSS preprocessor   no css preprocessor
  Database           postgresql
  ORM                prisma
  Testing            jest
  Authentication     jwt
  Linting            eslint
  API docs           swagger
-----------------------------------
? Create the project with these settings? Yes

✅ Generating project...
✅ Folder created.
✅ Express base registered.
✅ Prisma registered.
✅ Jest registered.
✅ JWT registered.
✅ ESLint registered.
✅ Swagger registered.
✅ Project scaffold generated.
✅ README registered.
✅ package.json created from your choices.
✅ Git initialized successfully.
✔ Dependencies installed.

🚀 Your project is ready!

📝 Next steps / notes:
  • Initialize Prisma: npx prisma init --datasource-provider=postgresql, then npx prisma migrate dev.
  • Protect routes with the auth middleware in src/middleware/auth (import authenticate).
  • Mount Swagger UI: app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec)).
```

Then start the server:

```bash
cd ecommerce
npm run dev   # yarn dev / pnpm dev
```

Visit `http://localhost:3000/health` — it responds `{"status":"ok", ...}`.

## Generated Project Structure

Every project is scaffolded with a sensible structure (extensions are `.ts` for TypeScript):

```text
my-app/
├── src/
│   ├── index.js          # server bootstrap: dotenv, db connect, app.listen
│   ├── app.js            # express app: helmet, cors, morgan, json, routes, error handler
│   ├── routes/
│   │   └── index.js      # GET / and GET /health
│   ├── controllers/
│   │   └── home.js       # index + health handlers
│   ├── middleware/
│   │   └── errorHandler.js
│   └── config/           # db.js / prisma.js / passport.js (when applicable)
├── .env                  # PORT and any selected secrets
├── .env.example
├── package.json          # built from your choices, pinned versions
├── .gitignore            # when Git is selected
└── README.md             # project-specific
```

Selected features wire themselves into the right place — e.g. Mongoose adds `connectDB()` to the bootstrap, a template engine adds `app.set("view engine", …)`, and JWT adds an auth middleware.

## Development (contributing to ExpressCraft)

```bash
git clone https://github.com/ravikisha/expresscraft
cd expresscraft
npm install

npm test          # vitest
npm run lint      # eslint
npm run format    # prettier --write
```

## Author
This project is created and maintained by [Ravi Kishan](https://github.com/ravikisha).

## Changelog
Check out the [CHANGELOG](CHANGELOG.md) for the latest updates and changes to the project.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request on the [GitHub repository](https://github.com/ravikisha/expresscraft).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

![footer](https://ravikisha.github.io/assets/personalLogo.png)