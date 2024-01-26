import { execSync } from "child_process";
import fs from "fs";
import chalk from "chalk";

export default class ProjectCreating {
  constructor(packageManager, language) {
    this.packageManager = packageManager;
    this.language = language;
  }

  // Creating Project
  creatingProject() {
    if (this.packageManager === "npm") {
      this.npmProjectCreating();
    } else if (this.packageManager === "yarn") {
      this.yarnProjectCreating();
    } else {
      console.log(chalk.red("Please select a package manager."));
      return;
    }
    console.log(chalk.green("Project created successfully."));
  }

  // Creating Project with NPM
  npmProjectCreating() {
    if (this.language === "javascript") {
      this.createProjectUsingNpmWithJs();
    } else if (this.language === "typescript") {
      this.createProjectUsingNpmWithTs();
    } else {
      console.log(chalk.red("Please select a language."));
      return;
    }
  }

  // Creating Project with Yarn
  yarnProjectCreating() {
    if (this.language === "javascript") {
      this.createProjectUsingYarnWithJs();
    } else if (this.language === "typescript") {
      this.createProjectUsingYarnWithTs();
    } else {
      console.log(chalk.red("Please select a language."));
      return;
    }
  }

  // Creating Project with JS and NPM
  createProjectUsingNpmWithJs() {
    // npm init -y is already executed in FolderCreating.js
    try {
      execSync("npm install express nodemon");
    } catch (err) {
      console.log(chalk.red("Something went wrong to install express."));
      return;
    }
  }

  // Creating Project with JS and Yarn
  createProjectUsingYarnWithJs() {
    // yarn init -y is already executed in FolderCreating.js
    try {
      execSync("yarn add express nodemon");
    } catch (err) {
      console.log(chalk.red("Something went wrong to install express."));
      return;
    }
  }

  // Creating Project with TS and NPM
  async createProjectUsingNpmWithTs() {
    // npm init -y is already executed in FolderCreating.js
    try {
      execSync("npm install express");
      execSync(
        "npm install -D typescript @types/express ts-node @types/node nodemon"
      );
      execSync("npx tsc --init");
      // update tsconfig.json file
      const config = {
        compilerOptions: {
          target: "es6",
          module: "commonjs",
          outDir: "./dist",
          rootDir: "./src",
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
        },
      };
      fs.writeFileSync("tsconfig.json", JSON.stringify(config, null, 2));
    } catch (err) {
      console.log(chalk.red("Something went wrong to install express."));
      return;
    }
  }

  // Creating Project with TS and Yarn
  createProjectUsingYarnWithTs() {
    // yarn init -y is already executed in FolderCreating.js
    try {
      execSync("yarn add express");
      execSync(
        "yarn add -D typescript @types/express ts-node @types/node nodemon"
      );
      execSync("npx tsc --init");
      // update tsconfig.json file
      const config = {
        compilerOptions: {
          target: "es6",
          module: "commonjs",
          outDir: "./dist",
          rootDir: "./src",
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
        },
      };
      fs.writeFileSync("tsconfig.json", JSON.stringify(config, null, 2));
    } catch (err) {
      console.log(chalk.red("Something went wrong to install express."));
      return;
    }
  }
}
