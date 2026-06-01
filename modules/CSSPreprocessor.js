import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default class CSSPreprocessor {
  constructor(manifest, cssPreprocessor) {
    this.manifest = manifest;
    this.cssPreprocessor = cssPreprocessor; // sass | less | stylus | postcss | no css preprocessor
  }

  register() {
    switch (this.cssPreprocessor) {
      case "sass":
        return this.sass();
      case "less":
        return this.simple("less", "Less");
      case "stylus":
        return this.simple("stylus", "Stylus");
      case "postcss":
        return this.simple("postcss postcss-cli", "PostCSS");
      case "no css preprocessor":
      default:
        console.log(chalk.yellow("🔔 No CSS Preprocessor selected."));
    }
  }

  simple(deps, label) {
    this.manifest.addDeps(deps, { dev: true });
    console.log(`✅ ${label} registered.`);
  }

  sass() {
    const m = this.manifest;
    m.addDeps("sass glob", { dev: true });

    // Ship the bundled Dart Sass compiler into the generated project.
    const compiler = fs.readFileSync(
      path.resolve(__dirname, "../lib/sass_compiler.js"),
      "utf8"
    );
    m.addFile("lib/sass_compiler.js", compiler);
    m.addFile(
      "styles/global.scss",
      `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
`
    );

    m.setScript("sass", "node lib/sass_compiler.js");
    m.appendScript("build", "node lib/sass_compiler.js");
    m.note(`Compile Sass with: ${m.runCommand("sass")}`);
    console.log("✅ Sass registered.");
  }
}
