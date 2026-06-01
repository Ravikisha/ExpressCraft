import chalk from "chalk";

export default class Linting {
  constructor(manifest, linting) {
    this.manifest = manifest;
    this.linting = linting; // "eslint" | "tslint" | "no linting"
  }

  register() {
    if (this.linting === "no linting" || !this.linting) {
      console.log(chalk.yellow("🔔 No Linting selected."));
      return;
    }
    if (this.linting === "tslint") {
      console.log(
        chalk.yellow("🔔 TSLint is deprecated — registering ESLint instead.")
      );
    }
    this.eslint();
  }

  eslint() {
    const m = this.manifest;
    m.addDevDep("eslint");
    m.setScript("lint", "eslint .");

    if (m.isTs()) {
      m.addDeps("@typescript-eslint/parser @typescript-eslint/eslint-plugin", {
        dev: true,
      });
      m.addFile(
        ".eslintrc.json",
        JSON.stringify(
          {
            parser: "@typescript-eslint/parser",
            plugins: ["@typescript-eslint"],
            extends: [
              "eslint:recommended",
              "plugin:@typescript-eslint/recommended",
            ],
            env: { node: true, es2021: true },
            parserOptions: { ecmaVersion: "latest", sourceType: "module" },
          },
          null,
          2
        )
      );
    } else {
      m.addFile(
        ".eslintrc.json",
        JSON.stringify(
          {
            extends: ["eslint:recommended"],
            env: { node: true, es2021: true },
            parserOptions: { ecmaVersion: "latest", sourceType: "module" },
          },
          null,
          2
        )
      );
    }
    console.log("✅ ESLint registered.");
  }
}
