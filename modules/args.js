/**
 * Minimal CLI flag parser (no dependency).
 *   expresscraft [name] --preset api --yes          (create mode, default)
 *   expresscraft add --db postgresql --orm prisma    (augment existing project)
 */
const CATEGORY_FLAGS = {
  "--template": "templateEngine",
  "--css": "cssFramework",
  "--preprocessor": "cssPreprocessor",
  "--db": "database",
  "--orm": "orm",
  "--testing": "testing",
  "--auth": "authentication",
  "--linting": "linting",
  "--docs": "apiDocumentation",
};

export function parseArgs(argv = process.argv.slice(2)) {
  const out = {
    command: "create", // "create" | "add"
    preset: null,
    name: null,
    pm: null,
    language: null,
    yes: false,
    force: false,
    dryRun: false,
    inject: false,
    help: false,
    docker: false,
    ci: false,
    hooks: false,
    logger: false,
    aiAssistants: [], // ["claude","copilot","cursor","agents"]
    aiSkills: [], // explicit skill ids; empty => all skills for chosen tools
    fetchSkills: false, // download official skills via `npx skills add`
    categories: {}, // canonical-ish category -> raw value (add mode)
  };

  let rest = argv;
  if (rest[0] === "add" || rest[0] === "create") {
    out.command = rest[0];
    rest = rest.slice(1);
  }

  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    const next = () => rest[++i];
    if (CATEGORY_FLAGS[a]) {
      out.categories[CATEGORY_FLAGS[a]] = next();
      continue;
    }
    switch (a) {
      case "-p":
      case "--preset":
        out.preset = next();
        break;
      case "-n":
      case "--name":
        out.name = next();
        break;
      case "--pm":
        out.pm = next();
        break;
      case "--ts":
        out.language = "typescript";
        break;
      case "--js":
        out.language = "javascript";
        break;
      case "-y":
      case "--yes":
        out.yes = true;
        break;
      case "-f":
      case "--force":
        out.force = true;
        break;
      case "--dry-run":
        out.dryRun = true;
        break;
      case "--inject":
        out.inject = true;
        break;
      case "--docker":
        out.docker = true;
        break;
      case "--ci":
        out.ci = true;
        break;
      case "--hooks":
        out.hooks = true;
        break;
      case "--logger":
        out.logger = true;
        break;
      case "--ai":
        out.aiAssistants = String(next() || "")
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean);
        break;
      case "--ai-skills":
        out.aiSkills = String(next() || "")
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean);
        break;
      case "--fetch-skills":
        out.fetchSkills = true;
        break;
      case "-h":
      case "--help":
        out.help = true;
        break;
      default:
        if (!a.startsWith("-") && !out.name) out.name = a;
    }
  }
  return out;
}

export const HELP = `
ExpressCraft — Express.js project generator

Usage:
  expresscraft [name] [options]            Create a new project (default)
  expresscraft add [options]               Add features to an existing project

Create options:
  -n, --name <name>      Project name
  -p, --preset <name>    Preset: minimal | api | mvc | fullstack
      --pm <manager>     Package manager: npm | yarn | pnpm
      --ts | --js        Language (TypeScript / JavaScript)
  -f, --force            Overwrite an existing folder without asking

Extras (create or add):
      --docker           Add Dockerfile + docker-compose
      --ci               Add a GitHub Actions workflow
      --hooks            Add Husky + lint-staged pre-commit
      --logger           Add a pino HTTP logger
      --ai <list>        AI assistant configs (skills + agents), comma-separated:
                         claude | copilot | cursor | agents
      --ai-skills <list> Limit AI skills to these ids (default: all for your
                         chosen tools), e.g. express,prisma,jwt,jest,docker
      --fetch-skills     Download official skills (where they exist) from
                         officialskills.sh via "npx skills add"

Add options (run inside an existing project):
      --db <name>        Database: mysql | postgresql | sqlite | mongodb
      --orm <name>       ORM: prisma | sequelize | typeorm | drizzle-orm | mongoose
      --auth <name>      Authentication: passport | jwt
      --testing <name>   Testing: jest | mocha+chai | jasmine
      --linting <name>   Linting: eslint
      --docs <name>      API docs: swagger | postman
      --template <name>  Template engine: ejs | pug | twig | handlebars
      --css <name>       CSS framework (e.g. "tailwind css", bootstrap)
      --preprocessor <name>  CSS preprocessor: sass | less | stylus | postcss
      --dry-run          Show planned changes, write nothing
      --force            Overwrite existing files / scripts

Common:
  -y, --yes              Non-interactive
  -h, --help             Show this help

Examples:
  expresscraft my-api --preset api --yes
  expresscraft my-api --preset api --ai claude,copilot --yes
  expresscraft add --db postgresql --orm prisma --testing jest --yes
  expresscraft add --ai claude --auth jwt --dry-run
`;
