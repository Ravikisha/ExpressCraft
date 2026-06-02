# ExpressCraft — Bugs, Errors, Improvements & Cleanups

Review of the ExpressCraft CLI (Express.js project generator). Items grouped by severity. Line references are approximate to the original (pre-refactor) snapshot.

---

## ✅ Implemented (Manifest refactor)

The full **build-package.json-from-choices → single-install-at-end** architecture is implemented and tested. Summary of what changed:

- **New `modules/Manifest.js`** — single source of truth. Modules `register()` deps/devDeps/scripts/files/notes; nothing installs inline.
- **New `Phases/install.js`** — one `npm install` / `yarn install` at the very end (`stdio: inherit`).
- **`index.js`** rewritten: `askQuestions → normalize → confirm → register all → write files → write package.json → install → notes → end`.
- **`Phases/askQuestions.js`** — ORM now conditional (`when` on database) + db-filtered choices; dead `validate` on lists removed; version read from package.json.
- Every module (`ProjectCreating`, `TemplateEngine`, `CSSFramework`, `DatabaseSetup`, `TestFramework`, `Authentication`, `Linting`, `Documentation`, `Readme`, `Code`) rewritten to register onto the Manifest.
- **Deleted dead files:** `modules/Config.js`, `modules/CSSPreprocessor.js`, `modules/Information.js`. Removed self-dep `"expresscraft":"file:"` and unused `cli-highlight`; bumped version to `1.4.0`; added `engines.node`.

**Bugs fixed by the refactor:** #1 (auth case-mismatch), #2 (JS Sequelize drivers), #3 (`nnpm` typo), #4 (`src/` entry file now emitted via `Code`), #5 (test scripts now persisted by the single writer), #6 (`styles/` only created when needed, `recursive`), #7 (CssFramework arg), #8 (folder fail now `process.exit(1)`), #9 (`no testing`), #10 (template engine no longer npm-only), #13 (nodemon is devDep), #15 (async flow), plus version mismatch, self-dep, README-copy, empty Information.js, dead validators, TSLint→ESLint, free-text lowercasing.

**Verified:** all files pass `node --check`; registration pipeline tested across TS-full-stack / JS-sequelize-mysql / mongo-mongoose; generated tree (`src/index.ts`, configs, `.gitignore`, `package.json`) confirmed; generated `package.json` resolves via `npm install` (518 pkgs, no errors).

### Round 2 (pnpm + remaining improvements)

- **pnpm support** — added as a package-manager choice. `Manifest.installCommand()` / `runCommand(script)` produce the right command per manager (`npm run x` vs `yarn x` vs `pnpm x`; `start`/`test` skip `run` on npm). `install.js`, `end.js`, `Readme.js`, and Tailwind/Sass notes all use these helpers.
- **#14 Tailwind v4** — adopted the v4 workflow: `tailwindcss` + `@tailwindcss/cli`, CSS-first config (`@import "tailwindcss";`), build via `npx @tailwindcss/cli -i … -o …`; dropped the v3 `init` + config file.
- **CSS Preprocessor re-enabled** — new `modules/CSSPreprocessor.js` + question (Sass/Less/Stylus/PostCSS). Sass ships a **Dart Sass** compiler (`lib/sass_compiler.js`, now `recursive` mkdir + `sass.compile`) and wires `sass`/`build` scripts; `node-sass` dropped.
- **projectName sanitization** — `askQuestions` rejects spaces/path-separators/invalid chars and leading `.`/`_`.
- **Tool-repo tooling** — added Prettier (`.prettierrc`, `.prettierignore`, `format`/`format:check` scripts); whole codebase formatted.
- **`.npmignore` → `files` allowlist** — package.json now `files`-allowlists shipped paths; `.npmignore` reduced to a dev-only fallback.
- **#12** — DB+ORM pairings constrained at the prompt (`when` + db-filtered ORM choices) and re-checked in `DatabaseSetup` (Mongoose requires MongoDB; SQL drivers validated; Prisma+MongoDB supported via provider).

**Verified (round 2):** all files `node --check` clean; pnpm/TS/Tailwind-v4/Sass/Jest pipeline produces correct `pnpm` commands, chained `build` script (`tsc && tailwindcss && sass`), v4 CSS, and a shipped Dart-Sass compiler; Prettier reports the repo formatted.

### Round 3 (scaffold + boilerplate + CLI UX + tooling)

**Project scaffold (`modules/Scaffold.js`):** generated projects now ship a real structure — `src/index.(js|ts)` (server bootstrap: dotenv, db connect, listen), `src/app.(js|ts)` (helmet/cors/morgan/json + contributed setup), `src/routes/index` (`/` + `/health`), `src/middleware/errorHandler`, `.env` + `.env.example`. Manifest gained a **code-fragment API** (`appImports`/`appSetup`/`serverImports`/`bootstrap`/`env`) so DB, auth and template-engine modules inject into the right file. `views/` + `app.set("view engine")` now wired for template engines. `Code.js` removed (superseded).

**DB/Auth boilerplate:** modules emit working files, not just deps —
- Mongoose → `src/config/db` + `connectDB()` wired into bootstrap + `MONGO_URI`.
- Sequelize → `src/config/db` instance (dialect-aware) + `authenticate()` bootstrap.
- TypeORM → `src/config/data-source` + `AppDataSource.initialize()`.
- Prisma → `src/config/prisma` client + `DATABASE_URL` + migrate note.
- Passport → `src/config/passport` strategy + session/initialize wiring + `SESSION_SECRET`.
- JWT → `src/middleware/auth` verify middleware + `JWT_SECRET`.

**CLI UX:** **presets** (`minimal`/`api`/`mvc`/`fullstack`) + a preset prompt; **non-interactive flags** (`--preset`, `--name`, `--pm`, `--ts/--js`, `--yes`, `--force`, `--help`) via `modules/args.js`; **summary table** before confirm (`Phases/summary.js`); **ora spinner** during install; **overwrite prompt** (or `--force`) instead of hard exit.

**Robustness + tooling:** **Vitest** suite (`tests/`, 13 tests incl. regressions for the sequelize-driver and mocha-script bugs); **rollback** — `generateProject` wrapped in try/catch, partial folder removed on failure; **pinned versions** (`modules/versions.js`, no more `"latest"`); **ESLint flat config** (`eslint.config.js`) + `lint`/`test` scripts; **modernized tsconfig** (`target es2022`, `moduleResolution node`, `include`/`exclude`).

**Verified (round 3):** all files `node --check` + ESLint clean (0 errors); Prettier clean; 13/13 Vitest pass; real `--preset minimal` run installs and the generated server **boots + answers `/health` and `/` with 200** (helmet/cors/morgan active); real `--preset api` (TypeScript, Prisma + JWT + Swagger) **type-checks with `tsc --noEmit` exit 0**.

### Round 4 (add-to-existing-project — Phase 1)

New **`expresscraft add`** subcommand augments an existing project safely (no source edits):
- **`modules/ProjectContext.js`** — detects package manager (lockfile), language (tsconfig/`*.ts`/dep), existing deps/scripts, entry file, git-dirty state, existing `.env` keys.
- **`modules/AddProject.js`** — computes a change plan and applies it: merges `package.json` (existing versions/scripts win, `package.json.bak` backup), writes only missing files (skips existing + warns, `--force` overrides), appends missing `.env` keys, emits **`EXPRESSCRAFT_SETUP.md`** with the manual wiring (imports/middleware/bootstrap) since source files are never edited.
- **`Phases/addQuestions.js`** — capability multiselect + per-category sub-prompts; `featuresFromFlags` for non-interactive use.
- **`modules/args.js`** — `add` subcommand, category flags (`--db --orm --auth --testing --linting --docs --template --css --preprocessor`), `--dry-run`, `--inject` (reserved for Phase 3), updated HELP.
- **`index.js`** — `runAdd`/`runCreate` dispatch; add-mode skips ProjectCreating/Scaffold/VersionControl/Readme and reuses feature modules + `install`.

**Verified (round 4):** eslint + prettier clean; **22/22 Vitest** (9 new add-mode tests: detection, dep/script/file/env merge rules, idempotency, setup-guide); real e2e on a hand-made legacy project — `--dry-run` previews correctly and writes nothing; real apply **merges deps (express version preserved), adds scripts/files/env, leaves `app.js` untouched, writes backup + setup guide, installs**; re-run is **idempotent** ("Nothing to add").

### Round 5 (add-to-existing-project — Phase 3, `--inject`)

**`modules/Injector.js`** — best-effort, dependency-free wiring into the existing entry file:
- Locates the file defining `const <app> = express()` across common candidates (entry/`src/app`/`src/index`/`app.js`/`server.js`); captures the real app variable name.
- Inserts new **imports** after the last import/require, and **middleware** (`app.use`/`app.set`) after the last existing one (or right after the app definition), rewriting the `app.` prefix to the detected variable.
- **Backs up** the target to `<file>.bak`, **idempotent** (skips lines already present), and **never injects bootstrap** (`await …`) since async placement isn't guaranteed — those stay in the guide.
- On any uncertainty (no `express()` found) → no edit, full fallback to `EXPRESSCRAFT_SETUP.md`.

Wired through `AddProject` (consumes injected groups, writes the guide for the remainder + reports the edited file) and `index.js`/`args.js` (`--inject`).

**Verified (round 5):** eslint + prettier clean; **26/26 Vitest** (4 new injector tests: import+middleware placement, app-var rename, no-express no-op, idempotent no-dup); real e2e — `add --auth passport --db mongodb --inject` edits `src/app.js` in place (session/passport `app.use` after `express.json()`, imports after `require("express")`, route/`listen` untouched), writes `.bak`, leaves `connectDB()` bootstrap in the guide, and the **injected file passes `node --check`**.

### Round 6 (extras + update-notifier)

New optional add-ons, available via the create-mode **"extras" checkbox**, `--docker/--ci/--hooks/--logger` flags (create or add mode), and presets (`api` → ci+hooks+logger; `fullstack` → +docker):
- **`modules/Docker.js`** — `Dockerfile` (TS builds + runs `dist`), `.dockerignore`, `docker-compose.yml` with a matching DB service (postgres/mysql/mongo) when a database is selected.
- **`modules/CI.js`** — GitHub Actions `ci.yml`; steps derived from the scripts that exist (lint/test/build), with a pnpm setup step when needed.
- **`modules/GitHooks.js`** — Husky + lint-staged + Prettier, `prepare: husky` script, `.husky/pre-commit`, `.lintstagedrc.json`.
- **`modules/Logger.js`** — pino + pino-http middleware fragment (wired into the app in create mode, into the guide in add mode) + pino-pretty.
- **update-notifier** — the CLI now notifies when a newer ExpressCraft is published.

Wired through create (`generateProject`, after Scaffold so CI sees final scripts; Logger before Scaffold so its fragment lands in the app) and add mode (`runAdd` + extras flags/picker). Summary table shows enabled extras.

**Verified (round 6):** eslint + prettier clean; **34/34 Vitest** (8 new extras tests: disabled no-op, Docker compose db service + TS build, CI script-gating + pnpm step, Husky files/script, pino deps+fragment); real e2e — `create --preset minimal --docker --ci --hooks --logger` generates all files, wires `app.use(pinoHttp())`, installs (Husky self-initializes via `prepare`), and the server **boots with structured pino logs + helmet/cors headers on `/health`**.

### Round 7 (controller scaffolding)

`Scaffold` now splits route handlers into a controller: `src/controllers/home.(js|ts)` exports `index`/`health`, and `src/routes/index` imports + wires them (`router.get("/", home.index)`). Cleaner separation, ready for users to add more controllers.

**Verified (round 7):** eslint + prettier clean; **34/34 Vitest** (generate test asserts the controllers file + `exports.health`); TS e2e — `tsc --noEmit` passes, build + boot returns 200 on `/` and `/health` through the controller.

**Still open (deferred):** multi-file inject when the express app and `app.listen` live in separate files (current `--inject` targets a single file).

---

## 🔴 Critical Bugs (feature silently broken)

### 1. Authentication never installs — case mismatch
**File:** `modules/Authentication.js` (`setupAuth`, lines 131–148)

`index.js` `assignAnswers()` lowercases every answer (`authentication = answers.authentication.toLowerCase()`, `packageManager`, `jsOrTs`). But `setupAuth()` compares against:
- `this.packageManager === "NPM"` / `"Yarn"` → actual value is `"npm"` / `"yarn"`
- `this.language === "JavaScript"` / `"TypeScript"` → actual value is `"javascript"` / `"typescript"`
- `this.authentication === "passportjs"` / `"jwt"` → choice label is `"Passport.js"` → lowercased to `"passport.js"` (note the dot), never `"passportjs"`

**Result:** no branch ever matches. Authentication dependencies are never installed and no error is shown.

**Fix:** normalize all comparisons to lowercase, and map the choice label. E.g. treat `"passport.js"` (or strip non-alphanumerics) and compare `"npm"`/`"javascript"`.

---

### 2. JS Sequelize always fails — capitalized switch cases
**File:** `modules/DatabaseSetup.js` (`sequelizeNpmJs` line 186, `sequelizeYarnJs` line 244)

These switch on `this.database` with cases `"MySQL"`, `"PostgreSQL"`, `"SQLite"`. But `database` is lowercased upstream, so it is `"mysql"` etc. → always hits `default` → `"❌ Unsupported database."` and the DB driver (mysql2/pg/sqlite3) is never installed.

(The TS variants `sequelizeNpmTs`/`sequelizeYarnTs` correctly use lowercase cases — inconsistent.)

**Fix:** use lowercase cases `"mysql"`, `"postgresql"`, `"sqlite"` everywhere.

---

### 3. `nnpm` typo — Semantic UI install crashes
**File:** `modules/CSSFramework.js` line 263

```js
execSync("nnpm install semantic-ui");   // "nnpm" → command not found
```
Throws → caught → `"❌ Something went wrong to install semantic ui."`. Semantic UI never installs.

**Fix:** `npm install semantic-ui`. (Also note: the `semantic-ui` npm package is effectively unmaintained; consider `fomantic-ui` or CDN.)

---

### 4. No source file / `src` folder is ever generated
**Files:** `modules/Code.js`, `index.js`

`Code.js` defines `typescriptExpressTemplate()`, `javascriptExpressTemplate()`, and `createSrcFolder()` — but `Code` is **never imported or instantiated** anywhere. Meanwhile:
- `Config.js` sets `main` to `src/index.js` / `dist/index.js`
- scripts: `dev: nodemon src/index.js` / `src/index.ts`, `start: node src/index.js` / `dist/index.js`

So the generated project points at entry files that do not exist. Running `npm run dev` immediately fails.

**Fix:** in `generateProject()`, instantiate `Code` and call `createSrcFolder()` so `src/index.js` / `src/index.ts` is written.

---

### 5. Test-script edits never written to disk (TS Jest, all Mocha, JS Jasmine)
**File:** `modules/TestFramework.js`

Only `jestNpmJs` (line 30) and `jestYarnJs` (line 53) call `fs.writeFileSync("package.json", ...)`. The following build the `packageJson` object and set `scripts.test` but **never write it back**:
- `jestNpmTs` (line 91), `jestYarnTs` (line 126)
- `mochaNpmJs` (line 144), `mochaYarnJs` (line 161), `mochaNpmTs` (line 179), `mochaYarnTs` (line 198)
- `jasmineNpmJs` (line 216), `jasmineYarnJs` (line 233)

(`jasmineNpmTs`/`jasmineYarnTs` write `jasmine.json` but still never persist the `test` script to `package.json`.)

**Result:** `npm test` is missing or stale for most combinations.

**Fix:** add `fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2), "utf-8")` after each edit, or centralize package.json writes (see Architecture section).

---

### 6. `styles/` dir created unconditionally → can crash the whole run
**File:** `modules/CSSFramework.js` constructor (lines 7–12)

```js
constructor(cssFramework, packageManager) {
  ...
  fs.mkdirSync("styles");   // runs even for "No CSS Framework"
}
```
`fs.mkdirSync` throws if `styles` already exists. Because the constructor runs for every project (including "No CSS Framework"), and the error is unguarded, an existing `styles/` directory throws an uncaught exception that aborts the entire generator.

**Fix:** only create `styles/` when a framework that needs it is selected, and use `fs.mkdirSync("styles", { recursive: true })` (no throw if present).

---

### 7. `CssFramework` constructed without `packageManager`
**File:** `index.js` line 109

```js
let cf = new CssFramework(cssFramework);   // packageManager missing
```
The constructor signature is `(cssFramework, packageManager)`. So inside the class `this.packageManager` is `undefined`, and every `if (this.packageManager === "npm")` / `"yarn"` branch is skipped — meaning **no CSS framework package is actually installed** (Tailwind, Bootstrap, etc. all silently skip the install step, though they still print "add this code" instructions).

**Fix:** `new CssFramework(cssFramework, packageManager)`.

---

### 8. `FolderCreating` failure doesn't stop the pipeline
**File:** `modules/FolderCreating.js` (lines 17–26)

On `fs.mkdirSync` failure (project already exists) it logs and `return`s — but `process.chdir(projectName)` never runs, so the **current working directory stays the CLI's own folder**. `generateProject()` keeps going and every subsequent step (`npm install`, writing `package.json`, `.gitignore`, etc.) **runs inside / corrupts the ExpressCraft tool directory itself.**

**Fix:** on failure, `process.exit(1)` (or throw) instead of `return`, and have `index.js` abort the pipeline.

---

## 🟠 Major Bugs / Correctness

### 9. "No Testing" never maps to `noTesting()`
**File:** `modules/TestFramework.js` `testSetup` (lines 351, 388)

Switch handles `case "none"`, but the inquirer choice is `"No Testing"` → lowercased `"no testing"`. So selecting "No Testing" falls through and does nothing (harmless but the friendly message never prints, and the `none` case is dead).

**Fix:** `case "no testing":`.

### 10. TemplateEngine ignores package manager & always uses `npm`
**File:** `modules/TemplateEngine.js`

`ejs()`, `pug()`, `twig()`, `handlebars()` all hardcode `execSync("npm install ...")`. A user who picked Yarn gets npm installs (mixed lockfiles). It also never configures Express (`app.set('view engine', ...)`) or creates a `views/` folder, so the engine isn't actually wired up.

### 11. Authentication / Documentation / Linting branch on un-normalized values
Beyond #1: `Authentication.setupAuth` compares `"NPM"`/`"Yarn"`/`"JavaScript"`. `Documentation.setupDocumentation` and `Linting.setupLinting` use lowercase and mostly work — but the inconsistency across modules is itself a bug source. Standardize a single canonical-value contract.

### 12. ORM asked even when "No Database" chosen
**File:** `Phases/askQuestions.js`

The `orm` question always shows, even for "No Database". Worse, valid DB+ORM pairings aren't enforced (e.g. Mongoose offered for MySQL; Prisma+MongoDB not handled — `mongodb` only maps `mongoose`/`no orm`, so `mongodb`+`prisma` prints "Unsupported ORM").

**Fix:** use inquirer `when:` to conditionally ask ORM, and filter `choices` by selected database.

### 13. `nodemon` installed as a production dependency
**File:** `modules/ProjectCreating.js` (line 51, JS path)

`npm install express nodemon` adds nodemon to `dependencies`. It's a dev tool → should be `--save-dev`. (The TS path correctly puts nodemon under `-D`.)

### 14. Tailwind commands are outdated (Tailwind v4)
**File:** `modules/CSSFramework.js` `tailwindCss()`

- `npx tailwindcss init` was removed in v4.
- Build script `npx tailwindcss build styles/global.css -o ...` uses old `build` subcommand; current CLI is `npx tailwindcss -i input.css -o output.css`.
- `tailwind.config.js` written as `module.exports` (CommonJS) while the project may be ESM.

Pin Tailwind v3 or update to the v4 workflow.

### 15. `async` methods not awaited
**File:** `index.js` `generateProject()` (not `async`), `ProjectCreating.creatingProject` calls async `createProjectUsingNpmWithTs`/`...WithTs` without `await`.

Currently survives only because everything inside uses synchronous `execSync`. It's fragile — any future async work (or rejected promise) becomes an unhandled rejection. Make the pipeline consistently `async/await`.

---

## 🟡 Minor Bugs / Inconsistencies

- **Version mismatch:** `package.json` `"version": "1.3.1"` vs banner `console.log("\n🎯 Version: 1.4.0")` in `index.js`. Single-source the version (read from `package.json`).
- **Self-referential dependency:** `package.json` has `"expresscraft": "file:"`. Circular/meaningless; `CSSPreprocessor.sass()` even reads `./node_modules/expresscraft/lib/sass_compiler.js` relying on this. Remove and resolve the bundled file via `import.meta.url` instead (as `Readme.js` already does).
- **README copied verbatim:** `modules/Readme.js` copies ExpressCraft's *own* 13 KB README into the generated project. The new project gets the tool's docs, not its own. Generate a minimal project-specific README instead.
- **`Information.js` is empty** (only imports). Dead file — remove or implement.
- **`lib/sass_compiler.js` dest dir** writes to `public/css` but never `mkdir`s it → `writeFileSync` fails if `public/css` absent. Also `node-sass` is deprecated → use `sass` (Dart Sass).
- **`validate` on `type: "list"` is ignored** by inquirer (every list question has a useless `validate`). Remove the dead validators.
- **Mongoose + TypeScript** doesn't install `@types/mongoose` parity (minor; modern mongoose ships its own types, so arguably fine — but inconsistent with other TS branches).
- **Postman docs install `newman`** (a Postman *collection runner*), which doesn't generate API docs. Misleading mapping.
- **TSLint is deprecated** (since 2019). Offering it as a linting choice steers users to a dead tool; drop it or replace with typescript-eslint.
- **`projectAuthor` / `projectDescription` optional** but `.toLowerCase()` is applied to them in `assignAnswers` — author names get force-lowercased (e.g. "Ravi Kishan" → "ravi kishan"). Only normalize the *enum* answers, not free-text fields.

---

## 🧹 Cleanups / Code Quality

- **Massive duplication in `DatabaseSetup.js`** (~800 lines): the 4-level nested switch (`language → packageManager → database → orm`) repeats. Collapse to a lookup table / strategy map keyed by `${orm}` with the DB driver chosen from a small map, and a single `pm.add(deps)` helper.
- **Repeated install boilerplate** everywhere: `try { execSync(...) } catch { console.log("❌ ...") }`. Extract one helper, e.g. `run(cmd, errMsg)` and `pmInstall(packageManager, pkgs, { dev })`.
- **`end.js`** has two near-identical branches (npm vs yarn) differing only by the run command. Parameterize the command word.
- **Magic separator strings** (`"-------------------"`) and emoji-laden `console.log`s duplicated across modules — centralize a tiny `logger`/`ui` module.
- **Commented-out features** (CSS Preprocessor, Task Runner, Hosting) left inline in `askQuestions.js` and `index.js`. Either wire them up or delete; don't ship dead blocks.
- **Mixed module casing/style:** some files use classes, some plain functions; indentation varies (2 vs 4 spaces). Add ESLint + Prettier to the tool's own repo.
- **No input validation / sanitization** of `projectName` before `fs.mkdirSync` and `process.chdir`. Reject names with path separators / invalid chars.
- **`.npmignore`** — verify it ships `modules/`, `Phases/`, `lib/`, `assets/` and excludes dev cruft, since this is published as a bin.

---

## 🚀 Feature Request: build `package.json` from choices, then a single install at the end

**Current behavior:** the generator runs `npm install <pkg>` / `yarn add <pkg>` incrementally inside ~30 different methods. This is slow (many network round-trips, repeated tree resolution), order-dependent, and means a mid-pipeline failure leaves a half-installed project.

**Goal:** collect all selections → assemble one `package.json` (deps + devDeps + scripts) → write it once → run **one** install at the very end.

### Proposed architecture

1. **Introduce a `ProjectManifest` accumulator** (single source of truth), e.g. `modules/Manifest.js`:
   ```js
   export default class Manifest {
     constructor({ name, description, author, language, packageManager }) {
       this.meta = { name, description, author };
       this.language = language;            // "javascript" | "typescript"
       this.packageManager = packageManager; // "npm" | "yarn"
       this.dependencies = new Set();
       this.devDependencies = new Set();
       this.scripts = {};
       this.postInstallNotes = [];          // the "add this code" hints, shown at the end
     }
     addDep(...pkgs)    { pkgs.forEach(p => this.dependencies.add(p)); }
     addDevDep(...pkgs) { pkgs.forEach(p => this.devDependencies.add(p)); }
     setScript(name, cmd) { this.scripts[name] = cmd; }
     note(msg) { this.postInstallNotes.push(msg); }
   }
   ```

2. **Refactor every module to *register*, not *install*.** Each module method changes from `execSync("npm install X")` to `manifest.addDep("X")` (and `addDevDep` / `setScript`). All the `execSync` install calls disappear from the modules.

   - `ProjectCreating` → `addDep("express")`, `addDevDep("nodemon")`; for TS also `typescript @types/express ts-node @types/node` as devDeps + write `tsconfig.json`.
   - `TemplateEngine` → `addDep("ejs")` etc. (respecting package manager is now irrelevant — only the manifest matters).
   - `DatabaseSetup` / `TestFramework` / `Authentication` / `Linting` / `Documentation` / `CSSFramework` → same pattern.
   - Config-file writers (tsconfig, jasmine.json, tailwind.config.js, .gitignore) stay as file writes — they don't need the network.

3. **Write `package.json` once** (replaces `Config.setupDetails` + every scattered package.json rewrite):
   ```js
   const pkg = {
     name: manifest.meta.name,
     version: "1.0.0",
     description: manifest.meta.description,
     author: manifest.meta.author,
     main: manifest.language === "typescript" ? "dist/index.js" : "src/index.js",
     type: "commonjs",
     scripts: manifest.scripts,
     dependencies:    sortedObjectWithLatest(manifest.dependencies),
     devDependencies: sortedObjectWithLatest(manifest.devDependencies),
   };
   fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));
   ```
   Use `"latest"` (or pinned versions) as the value for each dep so a single install resolves them.

4. **Run one install at the very end** (new `Phases/install.js`, called before `end()`):
   ```js
   import { execSync } from "child_process";
   export default function install(packageManager) {
     const cmd = packageManager === "yarn" ? "yarn install" : "npm install";
     console.log(`\n📦 Installing dependencies with ${packageManager}...`);
     execSync(cmd, { stdio: "inherit" });   // inherit → user sees progress
   }
   ```
   Since `package.json` already lists everything, `npm install` / `yarn install` resolves the whole tree in one pass.

5. **Confirmation step (optional but matches the ask).** After collecting answers and before generating, show a summary and a final `inquirer` `confirm` ("Create project with these settings?"). On "no", abort cleanly.

### `index.js` flow after refactor
```
welcome()
  → answers = await askQuestions()      // user choices
  → manifest = new Manifest(answers)
  → folderCreating(...)                 // mkdir + chdir ONLY (no npm init -y needed; we write package.json ourselves)
  → each module.register(manifest)      // populate deps/scripts, write config files
  → writePackageJson(manifest)          // create package.json from choices  ✅
  → new Code(...).createSrcFolder()     // FIX bug #4 — actually emit src/index.*
  → install(packageManager)             // single install at the end          ✅
  → print manifest.postInstallNotes
  → end(projectName, packageManager)
```

### Benefits
- One network resolution instead of ~10–15 → much faster, deterministic.
- `package.json` is correct even if a later step is skipped.
- No more "edited packageJson but forgot to writeFileSync" class of bugs (#5) — there's exactly one writer.
- Easy to add a `--dry-run` (write files, skip install) later.

### Migration note
`npm init -y` in `FolderCreating` becomes unnecessary (we author `package.json` directly). Drop it to avoid a throwaway file that the manifest then overwrites.

---

## Suggested fix priority
1. #4 (no src file), #7 (CssFramework missing arg), #1 (auth), #2 (sequelize), #6 (styles crash), #8 (chdir) — these make core output non-functional.
2. #5 (test scripts not saved), #3 (nnpm typo), #9–#13.
3. Feature: package.json-from-choices + single install (folds in fixes for #5, #10, #13).
4. Cleanups & deprecations (#14 Tailwind, TSLint, node-sass, dead files).
