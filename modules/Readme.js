export default class Readme {
  constructor(manifest) {
    this.manifest = manifest;
  }

  creatingReadme() {
    const m = this.manifest;
    const install = m.installCommand();
    const dev = m.runCommand("dev");
    const start = m.runCommand("start");
    const build = m.runCommand("build");

    const content = `# ${m.name}

${m.description || "An Express.js project generated with ExpressCraft."}

## Getting Started

\`\`\`bash
${install}
${dev}
\`\`\`

## Scripts

${Object.entries(m.scripts)
  .map(([name, cmd]) => `- \`${name}\` — \`${cmd}\``)
  .join("\n")}

## Production

\`\`\`bash
${m.isTs() ? `${build}\n${start}` : start}
\`\`\`

${m.author ? `\n_Author: ${m.author}_\n` : ""}
Generated with [ExpressCraft](https://github.com/Ravikisha/ExpressCraft).
`;

    this.manifest.addFile("README.md", content);
    console.log("✅ README registered.");
  }
}
