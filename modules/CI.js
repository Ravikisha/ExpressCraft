import chalk from "chalk";

/**
 * Generates a GitHub Actions workflow. Steps are derived from the scripts that
 * other modules registered, so it only runs lint/test/build when they exist.
 * Register this AFTER the feature modules so manifest.scripts is populated.
 */
export default class CI {
  constructor(manifest, { enabled }) {
    this.m = manifest;
    this.enabled = enabled;
  }

  register() {
    if (!this.enabled) return;
    const m = this.m;
    const pm = m.packageManager;
    const run = (script) => `      - run: ${m.runCommand(script)}`;

    const steps = [`      - run: ${pm} install`];
    if (m.scripts.lint) steps.push(run("lint"));
    if (m.scripts.test) steps.push(run("test"));
    if (m.scripts.build) steps.push(run("build"));

    const setupPm =
      pm === "pnpm"
        ? "      - uses: pnpm/action-setup@v4\n        with:\n          version: 9\n"
        : "";

    m.addFile(
      ".github/workflows/ci.yml",
      `name: CI

on:
  push:
    branches: [main, master]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
${setupPm}      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: ${pm}
${steps.join("\n")}
`
    );
    console.log(chalk.green("✅ GitHub Actions CI registered."));
  }
}
