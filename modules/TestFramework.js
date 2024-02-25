import fs from "fs";
import { execSync } from "child_process";
import chalk from "chalk";
import { highlight } from "cli-highlight";

export default class TestFramework {
  constructor(language, packageManager, TestFramework) {
    this.language = language;
    this.packageManager = packageManager;
    this.TestFramework = TestFramework;
  }
  /**
   * "No Testing", "Jest", "Mocha + Chai", "Jasmine"
   * packageManager: "npm" or "yarn"
   * language: "JavaScript" or "TypeScript"
   */

  /**
   * Jest Testing Framework
   * Npm package manager
   * Language: JavaScript
   */
  jestNpmJs() {
    try {
      execSync("npm i jest supertest cross-env --save-dev");
      // update the package.json file
      const data = fs.readFileSync("package.json", "utf8");
      const packageJson = JSON.parse(data);
      packageJson.scripts.test = "cross-env NODE_ENV=test jest --watchAll";
      fs.writeFileSync(
        "package.json",
        JSON.stringify(packageJson, null, 2),
        "utf-8"
      );
      console.log("✅ Jest installed successfully");
    } catch (e) {
      console.log("❌ Something went wrong to install jest.");
    }
  }

  /**
   * Jest Testing Framework
   * Yarn package manager
   * Language: JavaScript
   */
  jestYarnJs() {
    try {
      execSync("yarn add jest supertest cross-env --dev");
      // update the package.json file
      const data = fs.readFileSync("package.json", "utf8");
      const packageJson = JSON.parse(data);
      packageJson.scripts.test = "cross-env NODE_ENV=test jest --watchAll";
      fs.writeFileSync(
        "package.json",
        JSON.stringify(packageJson, null, 2),
        "utf-8"
      );
      console.log("✅ Jest installed successfully");
    } catch (e) {
      console.log("❌ Something went wrong to install jest.");
    }
  }

  /**
   * Jest Testing Framework
   * Npm package manager
   * Language: TypeScript
   */
  jestNpmTs() {
    try {
      execSync(
        "npm i jest ts-jest supertest cross-env @types/jest @types/supertest --save-dev");
      // update the tsconfig.json file
      const data = fs.readFileSync("tsconfig.json", "utf8");
      const tsconfig = JSON.parse(data);
      tsconfig.compilerOptions.types = ["node", "jest"];
      tsconfig.exclude = [
        "./coverage",
        "./dist",
        "__tests__",
        "jest.config.js",
      ];
      fs.writeFileSync(
        "tsconfig.json",
        JSON.stringify(tsconfig, null, 2),
        "utf-8"
      );
      // add jest.config.js file
      execSync("npx ts-jest config:init");
      // update the package.json file
      const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
      packageJson.scripts.test = "cross-env NODE_ENV=test jest --watchAll";
      console.log("✅ Jest installed successfully");
    } catch (e) {
      console.log("❌ Something went wrong to install jest.");
    }
  }

  /**
   * Jest Testing Framework
   * Yarn package manager
   * Language: TypeScript
   */
  jestYarnTs() {
    try {
      execSync(
        "yarn add jest ts-jest supertest cross-env @types/jest @types/supertest --dev");
      // update the tsconfig.json file
      const data = fs.readFileSync("tsconfig.json", "utf8");
      const tsconfig = JSON.parse(data);
      tsconfig.compilerOptions.types = ["node", "jest"];
      tsconfig.exclude = [
        "./coverage",
        "./dist",
        "__tests__",
        "jest.config.js",
      ];
      fs.writeFileSync(
        "tsconfig.json",
        JSON.stringify(tsconfig, null, 2),
        "utf-8"
      );
      // add jest.config.js file
      execSync("npx ts-jest config:init");
      // update the package.json file
      const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
      packageJson.scripts.test = "cross-env NODE_ENV=test jest --watchAll";
      console.log("✅ Jest installed successfully");
    } catch (e) {
      console.log("❌ Something went wrong to install jest.");
    }
  }

  /**
   * mocha + chai Testing Framework
   * Npm package manager
   * Language: JavaScript
   */

  mochaNpmJs() {
    try {
      execSync("npm i mocha chai request supertest --save-dev");
      // update the package.json file
      const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
      packageJson.scripts.test = "mocha --reporter spec";
      console.log("✅ Mocha + Chai installed successfully");
    } catch (e) {
      console.log("❌ Something went wrong to install mocha + chai");
    }
  }

  /**
   * mocha + chai Testing Framework
   * Yarn package manager
   * Language: JavaScript
   */
  mochaYarnJs() {
    try {
      execSync("yarn add mocha chai request supertest --dev");
      // update the package.json file
      const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
      packageJson.scripts.test = "mocha --reporter spec";
      console.log("✅ Mocha + Chai installed successfully");
    } catch (e) {
      console.log("❌ Something went wrong to install mocha + chai");
    }
  }

  /**
   * mocha + chai Testing Framework
   * Npm package manager
   * Language: TypeScript
   */
  mochaNpmTs() {
    try {
      execSync(
        "npm i mocha chai request supertest ts-node @types/mocha @types/chai --save-dev");
      // update the package.json file
      const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
      packageJson.scripts.test =
        "mocha --reporter spec --require ts-node/register";
      console.log("✅ Mocha + Chai installed successfully");
    } catch (e) {
      console.log("❌ Something went wrong to install mocha + chai");
    }
  }

  /**
   * mocha + chai Testing Framework
   * Yarn package manager
   * Language: TypeScript
   */
  mochaYarnTs() {
    try {
      execSync(
        "yarn add mocha chai request supertest ts-node @types/mocha @types/chai --dev");
      // update the package.json file
      const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
      packageJson.scripts.test =
        "mocha --reporter spec --require ts-node/register";
      console.log("✅ Mocha + Chai installed successfully");
    } catch (e) {
      console.log("❌ Something went wrong to install mocha + chai");
    }
  }

  /**
   * Jasmine Testing Framework
   * Npm package manager
   * Language: JavaScript
   */
  jasmineNpmJs() {
    try {
      execSync("npm i jasmine jasmine-node request supertest --save-dev");
      // update the package.json file
      const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
      packageJson.scripts.test = "./node_modules/.bin/jasmine-node spec";
      console.log("✅ Jasmine installed successfully");
    } catch (e) {
      console.log("❌ Something went wrong to install jasmine");
    }
  }

  /**
   * Jasmine Testing Framework
   * Yarn package manager
   * Language: JavaScript
   */
  jasmineYarnJs() {
    try {
      execSync("yarn add jasmine jasmine-node request supertest --dev");
      // update the package.json file
      const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
      packageJson.scripts.test = "./node_modules/.bin/jasmine-node spec";
      console.log("✅ Jasmine installed successfully");
    } catch (e) {
      console.log("❌ Something went wrong to install jasmine");
    }
  }

  /**
   * Jasmine Testing Framework
   * Npm package manager
   * Language: TypeScript
   */
  jasmineNpmTs() {
    try {
      execSync(
        "npm i jasmine jasmine-node jasmine-ts jasmine-spec-reporter request supertest ts-node @types/jasmine @types/jasmine-node --save-dev");
      // update the package.json file
      const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
      packageJson.scripts.test = "jasmine-ts --config=jasmine.json";
      // create jasmine.json file
      const jasmineConfig = {
        spec_dir: "spec",
        spec_files: ["**/*[sS]pec.ts"],
        helpers: ["helpers/**/*.ts"],
        stopSpecOnExpectationFailure: false,
        random: false,
      };
      fs.writeFileSync(
        "jasmine.json",
        JSON.stringify(jasmineConfig, null, 2),
        "utf-8"
      );

      console.log("✅ Jasmine installed successfully");
    } catch (e) {
      console.log("❌ Something went wrong to install jasmine");
    }
  }

  /**
   * Jasmine Testing Framework
   * Yarn package manager
   * Language: TypeScript
   */
  jasmineYarnTs() {
    try {
      execSync(
        "yarn add jasmine jasmine-node jasmine-ts jasmine-spec-reporter request supertest ts-node @types/jasmine @types/jasmine-node --dev");
      // update the package.json file
      const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
      packageJson.scripts.test = "jasmine-ts --config=jasmine.json";
      // create jasmine.json file
      const jasmineConfig = {
        spec_dir: "spec",
        spec_files: ["**/*[sS]pec.ts"],
        helpers: ["helpers/**/*.ts"],
        stopSpecOnExpectationFailure: false,
        random: false,
      };
      fs.writeFileSync(
        "jasmine.json",
        JSON.stringify(jasmineConfig, null, 2),
        "utf-8"
      );

      console.log("✅ Jasmine installed successfully");
    } catch (e) {
      console.log("❌ Something went wrong to install jasmine");
    }
  }

  /**
   * No Testing Framework
   * Npm package manager
   * Language: JavaScript
   */
  noTesting() {
    console.log(chalk.yellow("🔔 No Testing Framework selected"));
  }

  /**
   * Mapping the testing framework to the respective function
   */
  testSetup() {
    switch (this.language) {
      case "javascript":
        switch (this.TestFramework) {
          case "jest":
            switch (this.packageManager) {
              case "npm":
                this.jestNpmJs();
                break;
              case "yarn":
                this.jestYarnJs();
                break;
            }
            break;
          case "mocha + chai":
            switch (this.packageManager) {
              case "npm":
                this.mochaNpmJs();
                break;
              case "yarn":
                this.mochaYarnJs();
                break;
            }
            break;
          case "jasmine":
            switch (this.packageManager) {
              case "npm":
                this.jasmineNpmJs();
                break;
              case "yarn":
                this.jasmineYarnJs();
                break;
            }
            break;
          case "none":
            this.noTesting();
            break;
        }
        break;
      case "typescript":
        switch (this.TestFramework) {
          case "jest":
            switch (this.packageManager) {
              case "npm":
                this.jestNpmTs();
                break;
              case "yarn":
                this.jestYarnTs();
                break;
            }
            break;
          case "mocha + chai":
            switch (this.packageManager) {
              case "npm":
                this.mochaNpmTs();
                break;
              case "yarn":
                this.mochaYarnTs();
                break;
            }
            break;
          case "jasmine":
            switch (this.packageManager) {
              case "npm":
                this.jasmineNpmTs();
                break;
              case "yarn":
                this.jasmineYarnTs();
                break;
            }
            break;
          case "none":
            this.noTesting();
            break;
        }
        break;
    }
  }
}
