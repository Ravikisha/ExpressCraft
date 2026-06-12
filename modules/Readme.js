/**
 * Generates the project's README.md — a full guide covering the stack,
 * prerequisites, install, environment variables, run/build commands, scripts,
 * structure, and any per-feature setup notes the modules contributed.
 */
export default class Readme {
  constructor(manifest, opts = {}) {
    this.m = manifest;
    this.opts = opts || {};
  }

  // Human-readable rows of the selected stack (skips "no ..." choices).
  stackRows() {
    const o = this.opts;
    const rows = [
      ["Language", this.m.isTs() ? "TypeScript" : "JavaScript"],
      ["Package manager", this.m.packageManager],
      ["Template engine", o.templateEngine],
      ["CSS framework", o.cssFramework],
      ["CSS preprocessor", o.cssPreprocessor],
      ["Database", o.database],
      ["ORM", o.orm],
      ["Testing", o.testing],
      ["Authentication", o.authentication],
      ["Linting", o.linting],
      ["API docs", o.apiDocumentation],
    ];
    const extras = ["docker", "ci", "hooks", "logger"].filter((k) => o[k]);
    return rows
      .filter(([, v]) => v && !/^no /.test(String(v)))
      .map(([k, v]) => `| ${k} | ${v} |`)
      .concat(extras.length ? [`| Extras | ${extras.join(", ")} |`] : []);
  }

  envSection() {
    if (!this.m.env.length) return "";
    const rows = this.m.env
      .map((e) => `| \`${e.key}\` | ${e.value || "—"} | ${e.comment || ""} |`)
      .join("\n");
    return `## Environment variables

Copy \`.env.example\` to \`.env\` and fill in values:

\`\`\`bash
cp .env.example .env
\`\`\`

| Variable | Default | Notes |
| -------- | ------- | ----- |
${rows}

`;
  }

  scriptsSection() {
    const entries = Object.entries(this.m.scripts);
    if (!entries.length) return "";
    const rows = entries
      .map(([name, cmd]) => `| \`${this.m.runCommand(name)}\` | ${cmd} |`)
      .join("\n");
    return `## Scripts

| Command | Runs |
| ------- | ---- |
${rows}

`;
  }

  structureSection() {
    const ext = this.m.ext();
    return `## Project structure

\`\`\`text
${this.m.name}/
├── src/
│   ├── index.${ext}        # server entry: env, db connect, app.listen
│   ├── app.${ext}          # express app: security middleware, routes, error handler
│   ├── routes/           # route definitions
│   ├── controllers/      # request handlers
│   ├── middleware/       # custom middleware
│   └── config/           # db / auth config (when applicable)
├── .env / .env.example
├── package.json
└── README.md
\`\`\`

`;
  }

  notesSection() {
    if (!this.m.postInstallNotes.length) return "";
    return `## Setup notes

${this.m.postInstallNotes.map((n) => `- ${n}`).join("\n")}

`;
  }

  aiSection() {
    const ai = this.opts.aiAssistants || [];
    if (!ai.length) return "";
    return `## AI assistant configs

Skills and agents were generated for: **${ai.join(", ")}**. See \`AI_SKILLS.md\`
for the full list of skills, their sources, and how to fetch official versions
via \`npx skills add\`.

`;
  }

  creatingReadme() {
    const m = this.m;
    const install = m.installCommand();
    const dev = m.runCommand("dev");
    const start = m.runCommand("start");
    const build = m.runCommand("build");

    const prod = m.isTs()
      ? `\`\`\`bash\n${build}\n${start}\n\`\`\``
      : `\`\`\`bash\n${start}\n\`\`\``;

    const content = `# ${m.name}

${m.description || "An Express.js project generated with ExpressCraft."}

## Tech stack

| Component | Choice |
| --------- | ------ |
${this.stackRows().join("\n")}

## Prerequisites

- **Node.js >= 16**
- **${m.packageManager}** package manager
${this.opts.database && !/^no /.test(String(this.opts.database)) ? `- A running **${this.opts.database}** instance` : ""}

## Getting started

\`\`\`bash
${install}
${dev}
\`\`\`

The server starts on \`http://localhost:3000\`. Check \`http://localhost:3000/health\` — it returns \`{"status":"ok", ...}\`.

${this.envSection()}## Running

\`\`\`bash
${dev}     # development (watch mode)
\`\`\`

### Production

${prod}

${this.scriptsSection()}${this.structureSection()}${this.notesSection()}${this.aiSection()}---

${m.author ? `_Author: ${m.author}_\n\n` : ""}Generated with [ExpressCraft](https://github.com/Ravikisha/ExpressCraft).
`;

    m.addFile("README.md", content);
    console.log("✅ README registered.");
  }
}
