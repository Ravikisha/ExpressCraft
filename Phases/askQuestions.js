import inquirer from "inquirer";
import { PRESET_NAMES } from "../modules/presets.js";
import {
  skillChoices,
  canonicalizeRaw,
  skillIdsFor,
  anyOfficial,
} from "../modules/skillsCatalog.js";

// Folder/package-name safe: letters, numbers, dot, dash, underscore.
export const validProjectName = (value) => {
  const v = (value || "").trim();
  if (!v) return "Please enter your project name.";
  if (!/^[A-Za-z0-9._-]+$/.test(v))
    return "Use only letters, numbers, '.', '-' or '_' (no spaces or slashes).";
  if (/^[._]/.test(v)) return "Project name cannot start with '.' or '_'.";
  return true;
};

// Project metadata + optional preset selection.
export async function askProjectMeta() {
  return inquirer.prompt([
    {
      name: "projectName",
      type: "input",
      message: "What is your project name?",
      validate: validProjectName,
    },
    {
      name: "projectDescription",
      type: "input",
      message: "Project description? (optional)",
    },
    {
      name: "projectAuthor",
      type: "input",
      message: "Project author? (optional)",
    },
    {
      name: "preset",
      type: "list",
      message: "Start from a preset, or customize?",
      choices: [
        { name: "Custom (answer all questions)", value: "custom" },
        ...PRESET_NAMES.map((p) => ({ name: `Preset: ${p}`, value: p })),
      ],
    },
  ]);
}

// The full feature questionnaire (used when preset === "custom").
export async function askFeatures() {
  return inquirer.prompt([
    {
      name: "packageManager",
      type: "list",
      message: "Which package manager?",
      choices: ["NPM", "Yarn", "pnpm"],
    },
    {
      name: "jsOrTs",
      type: "list",
      message: "Which language?",
      choices: ["JavaScript", "TypeScript"],
    },
    {
      name: "versionControl",
      type: "list",
      message: "Which version control?",
      choices: ["Git", "SVN", "No Version Control"],
    },
    {
      name: "templateEngine",
      type: "list",
      message: "Which template engine?",
      choices: ["No Template Engine", "EJS", "Pug", "Twig", "Handlebars"],
    },
    {
      name: "cssFramework",
      type: "list",
      message: "Which CSS framework?",
      choices: [
        "No CSS Framework",
        "Tailwind CSS",
        "Bootstrap",
        "Bulma",
        "Foundation",
        "Materialize",
        "Semantic UI",
      ],
    },
    {
      name: "cssPreprocessor",
      type: "list",
      message: "Which CSS preprocessor?",
      choices: ["No CSS Preprocessor", "Sass", "Less", "Stylus", "PostCSS"],
    },
    {
      name: "database",
      type: "list",
      message: "Which database?",
      choices: ["No Database", "MySQL", "PostgreSQL", "SQLite", "MongoDB"],
    },
    {
      name: "orm",
      type: "list",
      message: "Which ORM?",
      when: (answers) => answers.database !== "No Database",
      choices: (answers) =>
        answers.database === "MongoDB"
          ? ["Mongoose", "Prisma", "No ORM"]
          : ["Prisma", "Sequelize", "TypeORM", "Drizzle-ORM", "No ORM"],
    },
    {
      name: "testing",
      type: "list",
      message: "Which testing framework?",
      choices: ["No Testing", "Jest", "Mocha + Chai", "Jasmine"],
    },
    {
      name: "authentication",
      type: "list",
      message: "Which authentication?",
      choices: ["No Authentication", "Passport.js", "JWT"],
    },
    {
      name: "linting",
      type: "list",
      message: "Which linting?",
      choices: ["No Linting", "ESLint", "TSLint"],
    },
    {
      name: "apiDocumentation",
      type: "list",
      message: "Which API documentation?",
      choices: ["No API Documentation", "Swagger", "Postman"],
    },
    {
      name: "extras",
      type: "checkbox",
      message: "Optional extras?",
      choices: [
        { name: "Docker (Dockerfile + compose)", value: "docker" },
        { name: "GitHub Actions CI", value: "ci" },
        { name: "Husky + lint-staged", value: "hooks" },
        { name: "Pino HTTP logger", value: "logger" },
      ],
    },
    {
      name: "aiAssistants",
      type: "checkbox",
      message: "AI assistant configs (skills + agents)?",
      choices: [
        { name: "Claude / Claude Code", value: "claude" },
        { name: "GitHub Copilot", value: "copilot" },
        { name: "Cursor", value: "cursor" },
        { name: "AGENTS.md (generic / other tools)", value: "agents" },
      ],
    },
    {
      name: "aiSkills",
      type: "checkbox",
      message: "Which tool skills + agents should the assistants get?",
      when: (a) => (a.aiAssistants || []).length > 0,
      choices: (a) => skillChoices(canonicalizeRaw(a)),
    },
    {
      name: "fetchSkills",
      type: "confirm",
      message:
        "Some of those tools have official skills on officialskills.sh. Download them now (npx skills add)?",
      default: false,
      when: (a) => {
        if (!(a.aiAssistants || []).length) return false;
        const ids = a.aiSkills && a.aiSkills.length
          ? a.aiSkills
          : skillIdsFor(canonicalizeRaw(a));
        return anyOfficial(ids);
      },
    },
  ]);
}
