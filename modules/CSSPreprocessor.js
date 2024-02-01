import fs from "fs";
import { execSync } from "child_process";
import chalk from "chalk";
import { highlight } from "cli-highlight";

export default class CSSPreprocessor {
  constructor(cssPreprocessor, packageManager) {
    this.cssPreprocessor = cssPreprocessor;
    this.packageManager = packageManager;
  }

  // CSS Preprocessor
  createCssPreprocessor() {
    if (this.cssPreprocessor === "sass") {
      this.sass();
      console.log(chalk.green("Sass initialized successfully."));
    } else if (this.cssPreprocessor === "less") {
      this.less();
      console.log(chalk.green("Less initialized successfully."));
    } else if (this.cssPreprocessor === "stylus") {
      this.stylus();
      console.log(chalk.green("Stylus initialized successfully."));
    } else if (this.cssPreprocessor === "postcss") {
      this.postcss();
      console.log(chalk.green("PostCSS initialized successfully."));
    } else if (this.cssPreprocessor === "no css preprocessor") {
      this.noCssPreprocessor();
    } else {
      console.log(chalk.red("Please select a CSS Preprocessor."));
      return;
    }
  }

  // Sass
  sass() {
    try {
      if (this.packageManager === "npm") {
        execSync("npm install -D node-sass glob");
      } else if (this.packageManager === "yarn") {
        execSync("yarn add -D node-sass glob");
      }

      // create a lib folder
      fs.mkdirSync("lib");
      // copy the sass_compiler.js file to the lib folder
      const sassCompiler = fs.readFileSync(
        "./node_modules/expresscraft/lib/sass_compiler.js",
        "utf8"
      );

      fs.writeFileSync("./lib/sass_compiler.js", sassCompiler);

      // update the package.json file
      const packageJson = JSON.parse(fs.readFileSync("package.json"));
      packageJson.scripts.sass = "node lib/sass_compiler.js";
      packageJson.scripts.build =
        packageJson.scripts.build + " && npm run sass";
      fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));

      // create a styles folder
      fs.mkdirSync("styles");
      // create a global.scss file
      fs.writeFileSync(
        "styles/global.scss",`
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}
`
      );
    } catch (err) {
      console.log(chalk.red("Error installing Sass."));
      return;
    }
  }

  // Less
  less() {
    try {
      if (this.packageManager === "npm") {
        execSync("npm install less");
      } else if (this.packageManager === "yarn") {
        execSync("yarn add less");
      }
    } catch (err) {
      console.log(chalk.red("Error installing Less."));
      return;
    }
  }

  // Stylus
  stylus() {
    try {
      if (this.packageManager === "npm") {
        execSync("npm install stylus");
      } else if (this.packageManager === "yarn") {
        execSync("yarn add stylus");
      }
    } catch (err) {
      console.log(chalk.red("Error installing Stylus."));
      return;
    }
  }

  //postcss
  postcss() {
    try {
      if (this.packageManager === "npm") {
        execSync("npm install postcss-cli");
      } else if (this.packageManager === "yarn") {
        execSync("yarn add postcss-cli");
      }
    } catch (err) {
      console.log(chalk.red("Error installing PostCSS."));
      return;
    }
  }

  // No CSS Preprocessor
  noCssPreprocessor() {
    console.log(chalk.yellow("No CSS Preprocessor initialized."));
  }
}
