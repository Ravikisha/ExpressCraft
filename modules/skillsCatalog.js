/**
 * skillsCatalog — maps each tool ExpressCraft can scaffold to an AI "skill"
 * (a reusable task recipe) and, for higher-value tools, an "agent" (a reviewer
 * persona). Modeled on the SKILL.md format popularized by
 * github.com/VoltAgent/awesome-agent-skills: each skill has a name + one-line
 * description and a short body.
 *
 * AIAssistants.js renders these into whatever AI service the user picked
 * (Claude, Copilot, Cursor, AGENTS.md). This module is the single source of
 * truth for "which feature produces which skill" and the skill content itself.
 *
 * Entry shape:
 *   id          unique slug (also the folder/file name)
 *   label       human title
 *   glob        cursor rule glob (optional; defaults to src globs)
 *   description (ctx) => one-line summary
 *   body        (ctx) => string[] of bullet points
 *   agent       optional { description(ctx), persona(ctx)=>string[] }
 *
 * ctx = { name, ext, lang }
 */

const SRC = "src/**/*.{js,ts}";

export const CATALOG = {
  // --- Base (always included) -------------------------------------------
  express: {
    id: "express",
    label: "Express routing & structure",
    glob: SRC,
    description: (c) =>
      `Scaffold and structure Express routes, controllers, and middleware in ${c.name}.`,
    body: (c) => [
      "Keep routers thin: map verbs/paths to controller functions, no business logic.",
      "Controllers are async; wrap bodies in try/catch and forward errors with next(err).",
      `Mount routers in src/app.${c.ext} via app.use("/resource", router).`,
      "Validate req.body/params/query before use; return explicit status codes (201/400/404).",
      "Read config and secrets from environment variables, never hard-code them.",
    ],
    agent: {
      description: () =>
        "Review Express route/controller/middleware changes for correctness and security.",
      persona: (c) => [
        `You review Express.js code in ${c.name} (${c.lang}).`,
        "Flag: unvalidated request input, async handlers not forwarding errors, wrong status codes, hard-coded secrets, business logic stuck in route files.",
        "Report each finding as file:line — problem — fix. Be concise.",
      ],
    },
  },

  // --- Language ----------------------------------------------------------
  typescript: {
    id: "typescript",
    label: "TypeScript for Express",
    glob: "src/**/*.ts",
    description: () => "Apply TypeScript best practices for an Express backend.",
    body: () => [
      "Enable strict mode in tsconfig.json; avoid `any` — prefer `unknown` + narrowing.",
      "Type req/res with the express Request/Response generics for params, body, query.",
      "Build to dist/ and run the compiled output in production.",
      "Validate external input at the boundary (e.g. zod) before trusting typed values.",
    ],
  },

  // --- Template engines --------------------------------------------------
  ejs: {
    id: "ejs",
    label: "EJS views",
    glob: "views/**/*.ejs",
    description: () => "Build and organize EJS views.",
    body: () => [
      "Put templates in views/ and set app.set('view engine', 'ejs').",
      "Use partials via include for header/footer; pass data with res.render('page', {...}).",
      "Escape user data with <%= %>; only use <%- %> for trusted HTML.",
    ],
  },
  pug: {
    id: "pug",
    label: "Pug views",
    glob: "views/**/*.pug",
    description: () => "Build and organize Pug views.",
    body: () => [
      "Templates in views/ with .pug; set app.set('view engine', 'pug').",
      "Reuse layout with extends/block and share markup via mixins.",
      "Interpolate with #{} (escaped); avoid != with untrusted data.",
    ],
  },
  twig: {
    id: "twig",
    label: "Twig views",
    glob: "views/**/*.twig",
    description: () => "Build and organize Twig views.",
    body: () => [
      "Use the twig package; set app.set('view engine', 'twig').",
      "Reuse layouts with {% extends %} and {% block %}.",
      "Autoescaping is on by default — keep it on for user data.",
    ],
  },
  handlebars: {
    id: "handlebars",
    label: "Handlebars views",
    glob: "views/**/*.hbs",
    description: () => "Build and organize Handlebars views.",
    body: () => [
      "Register hbs as the engine; keep layouts in views/layouts.",
      "Use partials and helpers; keep logic out of templates.",
      "{{ }} escapes; {{{ }}} does not — avoid triple-stache for user input.",
    ],
  },

  // --- CSS frameworks ----------------------------------------------------
  tailwind: {
    id: "tailwind",
    label: "Tailwind CSS",
    glob: "src/**/*.{css,html,ejs,pug,hbs}",
    description: () => "Set up and use Tailwind CSS.",
    body: () => [
      "Configure the content globs in tailwind.config so classes aren't purged.",
      "Compose utilities in markup; extract repeated patterns with @apply sparingly.",
      "Build CSS through the Tailwind/PostCSS pipeline into a static asset.",
    ],
  },
  bootstrap: {
    id: "bootstrap",
    label: "Bootstrap",
    glob: "src/**/*.{css,scss,html}",
    description: () => "Use Bootstrap for layout and components.",
    body: () => [
      "Prefer the grid and utility classes over custom CSS.",
      "Customize via Sass variables instead of overriding compiled CSS.",
    ],
  },
  bulma: {
    id: "bulma",
    label: "Bulma",
    glob: "src/**/*.{css,scss}",
    description: () => "Use the Bulma CSS framework.",
    body: () => [
      "Bulma is CSS-only; use its flexbox grid and component classes.",
      "Customize by overriding Sass variables before importing bulma.",
    ],
  },
  foundation: {
    id: "foundation",
    label: "Foundation",
    glob: "src/**/*.{css,scss}",
    description: () => "Use the Foundation framework.",
    body: () => [
      "Use the XY grid and components; import only the modules you need.",
      "Customize through the Sass settings file.",
    ],
  },
  materialize: {
    id: "materialize",
    label: "Materialize",
    glob: "src/**/*.{css,scss,js}",
    description: () => "Use Materialize CSS components.",
    body: () => [
      "Initialize JS components (modals, dropdowns) after the DOM loads.",
      "Customize colors via Sass or the palette helper classes.",
    ],
  },
  "semantic-ui": {
    id: "semantic-ui",
    label: "Semantic UI",
    glob: "src/**/*.{css,js}",
    description: () => "Use Semantic UI (or Fomantic) components.",
    body: () => [
      "Use component classes; initialize jQuery-based modules.",
      "Theme via the site.variables / theme.config build.",
    ],
  },

  // --- CSS preprocessors -------------------------------------------------
  sass: {
    id: "sass",
    label: "Sass",
    glob: "src/**/*.{scss,sass}",
    description: () => "Author styles with Sass.",
    body: () => [
      "Author .scss under src/styles; compile to CSS in the build step.",
      "Use variables, nesting, mixins, and partials (_file.scss) for structure.",
    ],
  },
  less: {
    id: "less",
    label: "Less",
    glob: "src/**/*.less",
    description: () => "Author styles with Less.",
    body: () => [
      "Compile .less with lessc in the build step.",
      "Use variables (@var) and mixins for reuse.",
    ],
  },
  stylus: {
    id: "stylus",
    label: "Stylus",
    glob: "src/**/*.styl",
    description: () => "Author styles with Stylus.",
    body: () => [
      "Compile .styl via stylus in the build step.",
      "Leverage the indentation syntax and mixins.",
    ],
  },
  postcss: {
    id: "postcss",
    label: "PostCSS",
    glob: "src/**/*.css",
    description: () => "Process CSS with PostCSS.",
    body: () => [
      "Configure plugins in postcss.config.",
      "Use autoprefixer and modern-CSS plugins; build into a static asset.",
    ],
  },

  // --- Databases ---------------------------------------------------------
  mysql: {
    id: "mysql",
    label: "MySQL",
    glob: SRC,
    description: () => "Work with MySQL from Express.",
    body: () => [
      "Read connection settings from env (host, user, password, db).",
      "Use a connection pool; never interpolate user input into SQL — use parameters.",
      "Run schema changes through migrations, not ad-hoc ALTERs.",
    ],
  },
  postgresql: {
    id: "postgresql",
    label: "PostgreSQL",
    glob: SRC,
    description: () => "Work with PostgreSQL from Express.",
    body: () => [
      "Read DATABASE_URL from env; use a pooled client.",
      "Always parameterize queries ($1, $2) to avoid SQL injection.",
      "Manage schema with migrations; add indexes for frequent queries.",
    ],
  },
  sqlite: {
    id: "sqlite",
    label: "SQLite",
    glob: SRC,
    description: () => "Work with SQLite from Express.",
    body: () => [
      "Use a file-based db for dev/small apps; store the path in env.",
      "Parameterize queries; enable WAL mode for concurrent reads.",
    ],
  },
  mongodb: {
    id: "mongodb",
    label: "MongoDB",
    glob: SRC,
    description: () => "Work with MongoDB from Express.",
    body: () => [
      "Read MONGO_URI from env; connect once at startup and reuse the client.",
      "Define indexes for query patterns; avoid unbounded find() results.",
      "Validate document shape before insert; never trust client-sent fields.",
    ],
  },

  // --- ORMs --------------------------------------------------------------
  prisma: {
    id: "prisma",
    label: "Prisma ORM",
    glob: "prisma/**/*.prisma, src/**/*.{js,ts}",
    description: (c) =>
      `Manage Prisma schema, migrations, and client queries in ${c.name}.`,
    body: () => [
      "Define models in prisma/schema.prisma; set the datasource url from env.",
      "Create migrations with `prisma migrate dev`; never edit applied migrations.",
      "Run `prisma generate` after schema changes; import a single shared PrismaClient.",
      "Use select/include to fetch only needed fields; rely on typed queries.",
    ],
    agent: {
      description: () => "Review Prisma schema and query changes.",
      persona: (c) => [
        `You review Prisma usage in ${c.name}.`,
        "Flag: schema edits without a migration, N+1 queries, unbounded findMany, multiple PrismaClient instances, secrets in the schema.",
        "Suggest a concrete fix per issue.",
      ],
    },
  },
  sequelize: {
    id: "sequelize",
    label: "Sequelize ORM",
    glob: SRC,
    description: () => "Work with Sequelize models and migrations.",
    body: () => [
      "Define models and associations; change schema via migrations, not sync({force}).",
      "Read DB config from env per environment.",
      "Use parameterized finders; escape any raw queries.",
    ],
  },
  typeorm: {
    id: "typeorm",
    label: "TypeORM",
    glob: SRC,
    description: () => "Work with TypeORM entities and migrations.",
    body: () => [
      "Define entities with decorators; enable migrations and disable synchronize in prod.",
      "Initialize the DataSource at startup before serving.",
      "Use the repository / query builder; parameterize all inputs.",
    ],
  },
  drizzle: {
    id: "drizzle",
    label: "Drizzle ORM",
    glob: SRC,
    description: () => "Work with Drizzle schema and migrations.",
    body: () => [
      "Define schema in TypeScript; generate SQL migrations with drizzle-kit.",
      "Use the typed query builder — inputs are parameterized.",
      "Keep the migrations folder under version control.",
    ],
  },
  mongoose: {
    id: "mongoose",
    label: "Mongoose ODM",
    glob: SRC,
    description: () => "Model MongoDB data with Mongoose.",
    body: () => [
      "Define schemas with types, required, and validation; compile to models.",
      "Connect once at startup (connectDB) and handle connection errors.",
      "Use lean() for read-heavy queries; declare indexes in the schema.",
    ],
  },

  // --- Testing -----------------------------------------------------------
  jest: {
    id: "jest",
    label: "Jest testing",
    glob: "**/*.{test,spec}.{js,ts}",
    description: (c) => `Write and run Jest tests for ${c.name}.`,
    body: (c) => [
      `Co-locate tests as *.test.${c.ext} or in __tests__; configure jest in package.json / jest.config.`,
      "Use supertest to exercise routes; assert status and body.",
      "Mock external services; keep unit tests isolated and deterministic.",
      "Run with coverage in CI and fail on regressions.",
    ],
    agent: {
      description: () => "Author and review Jest tests.",
      persona: (c) => [
        `You write and review Jest tests for ${c.name} (${c.lang}).`,
        "Ensure: routes covered via supertest, error paths tested, no shared mutable state, mocks reset between tests.",
        "Propose missing test cases for untested branches.",
      ],
    },
  },
  "mocha-chai": {
    id: "mocha-chai",
    label: "Mocha + Chai testing",
    glob: "test/**/*.{js,ts}",
    description: () => "Write Mocha + Chai tests.",
    body: () => [
      "Put specs in test/ and run with mocha; assert with chai expect.",
      "Use supertest / chai-http for route tests.",
      "Use beforeEach/afterEach to isolate state.",
    ],
  },
  jasmine: {
    id: "jasmine",
    label: "Jasmine testing",
    glob: "spec/**/*.{js,ts}",
    description: () => "Write Jasmine tests.",
    body: (c) => [
      `Specs in spec/ as *Spec.${c.ext}; configure jasmine.json.`,
      "Use describe/it with expect matchers.",
      "Isolate state with beforeEach; spy on dependencies.",
    ],
  },

  // --- Authentication ----------------------------------------------------
  passport: {
    id: "passport",
    label: "Passport.js auth",
    glob: SRC,
    description: () => "Set up Passport.js authentication.",
    body: (c) => [
      `Configure strategies in src/config/passport.${c.ext}; serialize/deserialize users.`,
      "Mount express-session before passport.initialize() / passport.session().",
      "Store the session secret in env; protect routes with req.isAuthenticated().",
    ],
    agent: {
      description: () => "Review authentication/session code for security.",
      persona: (c) => [
        `You review Passport/session auth in ${c.name}.`,
        "Flag: secrets in code, missing CSRF protection, cookies without secure/httpOnly, unprotected sensitive routes, weak password handling.",
        "Report file:line — risk — fix.",
      ],
    },
  },
  jwt: {
    id: "jwt",
    label: "JWT auth",
    glob: SRC,
    description: () => "Implement JWT authentication.",
    body: (c) => [
      "Sign tokens with a secret/keys from env and set a sensible expiry.",
      `Verify tokens in middleware (src/middleware/auth.${c.ext}) and attach req.user.`,
      "Never put secrets in the payload; pin the algorithm; reject expired/invalid tokens.",
    ],
    agent: {
      description: () => "Review JWT auth for security issues.",
      persona: (c) => [
        `You review JWT auth in ${c.name}.`,
        "Flag: hard-coded secrets, missing expiry, accepting alg:none, tokens in URLs/logs, unprotected routes.",
        "Report file:line — risk — fix.",
      ],
    },
  },

  // --- Linting -----------------------------------------------------------
  eslint: {
    id: "eslint",
    label: "ESLint",
    glob: SRC,
    description: () => "Configure and use ESLint.",
    body: () => [
      "Keep config in the eslint config file; extend a shared base ruleset.",
      "Expose a lint script; auto-fix on commit if hooks are enabled.",
      "Treat lint errors as CI failures.",
    ],
  },
  tslint: {
    id: "tslint",
    label: "TSLint (legacy)",
    glob: "src/**/*.ts",
    description: () => "Maintain TSLint config (deprecated).",
    body: () => [
      "TSLint is deprecated — prefer migrating to ESLint + @typescript-eslint.",
      "Keep rules in tslint.json; run via the lint script.",
    ],
  },

  // --- API documentation -------------------------------------------------
  swagger: {
    id: "swagger",
    label: "Swagger / OpenAPI",
    glob: SRC,
    description: () => "Document the API with Swagger/OpenAPI.",
    body: () => [
      "Define an OpenAPI spec and serve docs via swagger-ui-express.",
      "Keep the spec in sync with routes; document params, bodies, and responses.",
      "Describe auth schemes and error responses.",
    ],
  },
  postman: {
    id: "postman",
    label: "Postman collection",
    glob: SRC,
    description: () => "Maintain a Postman collection.",
    body: () => [
      "Keep a versioned collection covering every endpoint.",
      "Use environments/variables for base URL and tokens.",
      "Add example responses and request tests.",
    ],
  },

  // --- Extras ------------------------------------------------------------
  docker: {
    id: "docker",
    label: "Docker",
    glob: "Dockerfile, docker-compose.yml, .dockerignore",
    description: (c) => `Containerize ${c.name}.`,
    body: () => [
      "Use a slim node base image; multi-stage build for TS (build, then run dist).",
      "Copy package files and install before copying source for layer caching.",
      "Run as a non-root user; expose the app port; pass config via env.",
      "Wire app + database together with docker-compose for local dev.",
    ],
    agent: {
      description: () => "Review Dockerfile/compose for size and security.",
      persona: (c) => [
        `You review container config in ${c.name}.`,
        "Flag: running as root, secrets baked into the image, no .dockerignore, latest tags, missing healthcheck, fat images.",
        "Suggest a concrete fix per issue.",
      ],
    },
  },
  "github-actions": {
    id: "github-actions",
    label: "GitHub Actions CI",
    glob: ".github/workflows/*.yml",
    description: () => "Maintain the GitHub Actions CI workflow.",
    body: () => [
      "Run install, lint, test, and build on push and pull_request.",
      "Cache dependencies and pin action versions.",
      "Fail the build on lint/test errors before merge.",
    ],
  },
  husky: {
    id: "husky",
    label: "Husky + lint-staged",
    glob: ".husky/*",
    description: () => "Manage Husky + lint-staged pre-commit hooks.",
    body: () => [
      "Run lint-staged on staged files in the pre-commit hook.",
      "Keep hooks fast — lint/format only changed files.",
      "Install hooks via the prepare script.",
    ],
  },
  pino: {
    id: "pino",
    label: "Pino logging",
    glob: SRC,
    description: () => "Use structured logging with pino.",
    body: () => [
      "Add pino-http middleware early in the stack.",
      "Log JSON in production; pipe through pino-pretty in dev.",
      "Never log secrets/PII; attach request ids for tracing.",
    ],
  },
};

// Canonical (lowercase) feature value -> skill id, per category.
const ORM = {
  prisma: "prisma",
  sequelize: "sequelize",
  typeorm: "typeorm",
  "drizzle-orm": "drizzle",
  mongoose: "mongoose",
};
const DB = {
  mysql: "mysql",
  postgresql: "postgresql",
  sqlite: "sqlite",
  mongodb: "mongodb",
};
const TEST = { jest: "jest", "mocha + chai": "mocha-chai", jasmine: "jasmine" };
const AUTH = { passport: "passport", jwt: "jwt" };
const TPL = { ejs: "ejs", pug: "pug", twig: "twig", handlebars: "handlebars" };
const CSS = {
  "tailwind css": "tailwind",
  bootstrap: "bootstrap",
  bulma: "bulma",
  foundation: "foundation",
  materialize: "materialize",
  "semantic ui": "semantic-ui",
};
const PRE = { sass: "sass", less: "less", stylus: "stylus", postcss: "postcss" };
const LINT = { eslint: "eslint", tslint: "tslint" };
const DOCS = { swagger: "swagger", postman: "postman" };

/**
 * Given a normalized (lowercase) features object, return the skill ids that
 * apply. Express is always included. Unknown / "no ..." values are skipped.
 */
export function skillIdsFor(f = {}) {
  const ids = ["express"];
  const add = (id) => id && CATALOG[id] && ids.push(id);

  if (f.language === "typescript") add("typescript");
  add(TPL[f.templateEngine]);
  add(CSS[f.cssFramework]);
  add(PRE[f.cssPreprocessor]);
  add(DB[f.database]);
  add(ORM[f.orm]);
  add(TEST[f.testing]);
  add(AUTH[f.authentication]);
  add(LINT[f.linting]);
  add(DOCS[f.apiDocumentation]);
  if (f.docker) add("docker");
  if (f.ci) add("github-actions");
  if (f.hooks) add("husky");
  if (f.logger) add("pino");

  return [...new Set(ids)];
}

const REGISTRY = "https://officialskills.sh";

/**
 * Verified official skills (from officialskills.sh) that correspond to an
 * ExpressCraft tool. Installed with `npx skills add <repo> --skill <name>`.
 * Most ExpressCraft tools have NO official skill — those fall back to a browse
 * URL and a locally-authored starter (see sourceFor + AIAssistants).
 *
 * IMPORTANT: ExpressCraft does NOT bundle these skills' content. It only points
 * at the source and can fetch them on demand via `--fetch-skills`.
 */
export const SOURCES = {
  postgresql: {
    repo: "https://github.com/supabase/agent-skills",
    skill: "postgres-best-practices",
    url: `${REGISTRY}/supabase/skills/postgres-best-practices`,
  },
  mongodb: {
    repo: "https://github.com/mongodb/agent-skills",
    skill: "mongodb-schema-design",
    url: `${REGISTRY}/mongodb/skills/mongodb-schema-design`,
  },
  mongoose: {
    repo: "https://github.com/mongodb/agent-skills",
    skill: "mongodb-schema-design",
    url: `${REGISTRY}/mongodb/skills/mongodb-schema-design`,
  },
};

/**
 * Resolve where a skill comes from.
 *   official => has a verified upstream skill: { official:true, repo, skill, url, install }
 *   otherwise => browse the registry: { official:false, browse }
 */
export function sourceFor(id) {
  const s = SOURCES[id];
  if (s) {
    return {
      official: true,
      repo: s.repo,
      skill: s.skill,
      url: s.url,
      install: `npx skills add ${s.repo} --skill ${s.skill}`,
    };
  }
  const label = CATALOG[id] ? CATALOG[id].label : id;
  return {
    official: false,
    browse: `${REGISTRY}/?q=${encodeURIComponent(label.split(" ")[0])}`,
  };
}

/** True if any of the given skill ids has a verified official source. */
export function anyOfficial(skillIds = []) {
  return skillIds.some((id) => SOURCES[id]);
}

/**
 * Build inquirer checkbox choices (all preselected) for the skills available
 * given a features object. Used by the interactive "which skills?" question.
 */
export function skillChoices(f = {}) {
  return skillIdsFor(f).map((id) => {
    const s = CATALOG[id];
    return {
      name: `${s.label}${s.agent ? " (skill + agent)" : " (skill)"}`,
      value: id,
      checked: true,
    };
  });
}

/**
 * Map raw inquirer answers (display values like "Prisma", "Passport.js") to
 * the lowercase shape skillIdsFor/skillChoices expect. Mirrors the relevant
 * bits of index.js normalizeFeatures so the question can compute choices
 * before normalization runs.
 */
export function canonicalizeRaw(a = {}) {
  const lc = (v) => (v || "").toLowerCase();
  const extras = new Set(a.extras || []);
  return {
    language: lc(a.jsOrTs),
    templateEngine: lc(a.templateEngine),
    cssFramework: lc(a.cssFramework),
    cssPreprocessor: lc(a.cssPreprocessor),
    database: lc(a.database),
    orm: lc(a.orm),
    testing: lc(a.testing),
    authentication: AUTH[lc(a.authentication).replace(".js", "")]
      ? lc(a.authentication).replace(".js", "")
      : "no authentication",
    linting: lc(a.linting),
    apiDocumentation: lc(a.apiDocumentation),
    docker: extras.has("docker"),
    ci: extras.has("ci"),
    hooks: extras.has("hooks"),
    logger: extras.has("logger"),
  };
}
