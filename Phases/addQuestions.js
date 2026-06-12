import inquirer from "inquirer";
import { skillChoices, anyOfficial } from "../modules/skillsCatalog.js";

// Defaults mean "don't add this category".
export const NONE = {
  templateEngine: "no template engine",
  cssFramework: "no css framework",
  cssPreprocessor: "no css preprocessor",
  database: "no database",
  orm: "no orm",
  testing: "no testing",
  authentication: "no authentication",
  linting: "no linting",
  apiDocumentation: "no api documentation",
  docker: false,
  ci: false,
  hooks: false,
  logger: false,
  aiAssistants: [],
  aiSkills: null,
  fetchSkills: false,
};

const CATEGORIES = [
  { name: "Database + ORM", value: "database" },
  { name: "Authentication", value: "authentication" },
  { name: "Testing framework", value: "testing" },
  { name: "Linting", value: "linting" },
  { name: "API documentation", value: "apiDocumentation" },
  { name: "Template engine", value: "templateEngine" },
  { name: "CSS framework", value: "cssFramework" },
  { name: "CSS preprocessor", value: "cssPreprocessor" },
  { name: "Docker", value: "docker" },
  { name: "GitHub Actions CI", value: "ci" },
  { name: "Husky + lint-staged", value: "hooks" },
  { name: "Pino logger", value: "logger" },
  { name: "AI assistant configs (skills + agents)", value: "aiAssistants" },
];

const AUTH = {
  "Passport.js": "passport",
  JWT: "jwt",
};

export async function askAddFeatures() {
  const { picked } = await inquirer.prompt([
    {
      name: "picked",
      type: "checkbox",
      message: "What do you want to add?",
      choices: CATEGORIES,
      validate: (a) => (a.length ? true : "Select at least one."),
    },
  ]);

  const out = { ...NONE };

  if (picked.includes("database")) {
    const a = await inquirer.prompt([
      {
        name: "database",
        type: "list",
        message: "Which database?",
        choices: ["MySQL", "PostgreSQL", "SQLite", "MongoDB"],
      },
      {
        name: "orm",
        type: "list",
        message: "Which ORM?",
        choices: (ans) =>
          ans.database === "MongoDB"
            ? ["Mongoose", "Prisma", "No ORM"]
            : ["Prisma", "Sequelize", "TypeORM", "Drizzle-ORM", "No ORM"],
      },
    ]);
    out.database = a.database.toLowerCase();
    out.orm = a.orm.toLowerCase();
  }

  if (picked.includes("authentication")) {
    const { authentication } = await inquirer.prompt([
      {
        name: "authentication",
        type: "list",
        message: "Which authentication?",
        choices: ["Passport.js", "JWT"],
      },
    ]);
    out.authentication = AUTH[authentication];
  }

  if (picked.includes("testing")) {
    const { testing } = await inquirer.prompt([
      {
        name: "testing",
        type: "list",
        message: "Which testing framework?",
        choices: ["Jest", "Mocha + Chai", "Jasmine"],
      },
    ]);
    out.testing = testing.toLowerCase();
  }

  if (picked.includes("linting")) out.linting = "eslint";

  out.docker = picked.includes("docker");
  out.ci = picked.includes("ci");
  out.hooks = picked.includes("hooks");
  out.logger = picked.includes("logger");

  if (picked.includes("apiDocumentation")) {
    const { apiDocumentation } = await inquirer.prompt([
      {
        name: "apiDocumentation",
        type: "list",
        message: "Which API documentation?",
        choices: ["Swagger", "Postman"],
      },
    ]);
    out.apiDocumentation = apiDocumentation.toLowerCase();
  }

  if (picked.includes("templateEngine")) {
    const { templateEngine } = await inquirer.prompt([
      {
        name: "templateEngine",
        type: "list",
        message: "Which template engine?",
        choices: ["EJS", "Pug", "Twig", "Handlebars"],
      },
    ]);
    out.templateEngine = templateEngine.toLowerCase();
  }

  if (picked.includes("cssFramework")) {
    const { cssFramework } = await inquirer.prompt([
      {
        name: "cssFramework",
        type: "list",
        message: "Which CSS framework?",
        choices: [
          "Tailwind CSS",
          "Bootstrap",
          "Bulma",
          "Foundation",
          "Materialize",
          "Semantic UI",
        ],
      },
    ]);
    out.cssFramework = cssFramework.toLowerCase();
  }

  if (picked.includes("cssPreprocessor")) {
    const { cssPreprocessor } = await inquirer.prompt([
      {
        name: "cssPreprocessor",
        type: "list",
        message: "Which CSS preprocessor?",
        choices: ["Sass", "Less", "Stylus", "PostCSS"],
      },
    ]);
    out.cssPreprocessor = cssPreprocessor.toLowerCase();
  }

  if (picked.includes("aiAssistants")) {
    const { aiAssistants, aiSkills, fetchSkills } = await inquirer.prompt([
      {
        name: "aiAssistants",
        type: "checkbox",
        message: "Which AI assistant configs?",
        choices: [
          { name: "Claude / Claude Code", value: "claude" },
          { name: "GitHub Copilot", value: "copilot" },
          { name: "Cursor", value: "cursor" },
          { name: "AGENTS.md (generic / other tools)", value: "agents" },
        ],
        validate: (a) => (a.length ? true : "Select at least one."),
      },
      {
        name: "aiSkills",
        type: "checkbox",
        message: "Which tool skills + agents should the assistants get?",
        // Skills are derived from the categories chosen above (in `out`).
        choices: () => skillChoices(out),
      },
      {
        name: "fetchSkills",
        type: "confirm",
        message:
          "Some of those tools have official skills on officialskills.sh. Download them now (npx skills add)?",
        default: false,
        when: (a) => anyOfficial(a.aiSkills || []),
      },
    ]);
    out.aiAssistants = aiAssistants;
    out.aiSkills = aiSkills;
    out.fetchSkills = !!fetchSkills;
  }

  return out;
}

// Build the same shape from non-interactive --category flags.
export function featuresFromFlags(categories) {
  const out = { ...NONE };
  const auth = { passport: "passport", "passport.js": "passport", jwt: "jwt" };
  for (const [key, raw] of Object.entries(categories)) {
    if (!raw) continue;
    const v = String(raw).toLowerCase();
    out[key] = key === "authentication" ? (auth[v] ?? v) : v;
  }
  return out;
}
