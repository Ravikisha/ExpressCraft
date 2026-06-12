/**
 * Presets express a full set of (already-normalized) choices so users can skip
 * the 14 prompts. Used by --preset <name> and the "preset" prompt.
 */
const base = {
  versionControl: "git",
  templateEngine: "no template engine",
  cssFramework: "no css framework",
  cssPreprocessor: "no css preprocessor",
  database: "no database",
  orm: "no orm",
  testing: "no testing",
  authentication: "no authentication",
  linting: "no linting",
  apiDocumentation: "no api documentation",
  aiAssistants: [],
};

const PRESETS = {
  minimal: {
    ...base,
    packageManager: "npm",
    language: "javascript",
  },
  api: {
    ...base,
    packageManager: "npm",
    language: "typescript",
    database: "postgresql",
    orm: "prisma",
    testing: "jest",
    authentication: "jwt",
    linting: "eslint",
    apiDocumentation: "swagger",
    ci: true,
    hooks: true,
    logger: true,
  },
  mvc: {
    ...base,
    packageManager: "npm",
    language: "javascript",
    templateEngine: "ejs",
    cssFramework: "bootstrap",
    cssPreprocessor: "sass",
    database: "mongodb",
    orm: "mongoose",
    testing: "jest",
    authentication: "passport",
    linting: "eslint",
  },
  fullstack: {
    ...base,
    packageManager: "pnpm",
    language: "typescript",
    templateEngine: "ejs",
    cssFramework: "tailwind css",
    cssPreprocessor: "sass",
    database: "postgresql",
    orm: "prisma",
    testing: "jest",
    authentication: "jwt",
    linting: "eslint",
    apiDocumentation: "swagger",
    docker: true,
    ci: true,
    hooks: true,
    logger: true,
  },
};

export const PRESET_NAMES = Object.keys(PRESETS);

export function getPreset(name) {
  const p = PRESETS[name];
  return p ? { ...p } : null;
}

export default PRESETS;
