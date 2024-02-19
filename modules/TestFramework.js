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
  jestNpmJs(){
    try{
        execSync("npm i jest supertest cross-env --save-dev", { stdio: "inherit" });
        // update the package.json file
        const data = fs.readFileSync("package.json", "utf8");
        const packageJson = JSON.parse(data);
        packageJson.scripts.test = "cross-env NODE_ENV=test jest --watchAll";
        fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2), "utf-8");
        console.log(chalk.green("Jest installed successfully"));
    }catch(e){
        console.log(chalk.red(e));
    }
  }

    /**
     * Jest Testing Framework
     * Yarn package manager
     * Language: JavaScript
     */
    jestYarnJs(){
        try{
            execSync("yarn add jest supertest cross-env --dev", { stdio: "inherit" });
            // update the package.json file
            const data = fs.readFileSync("package.json", "utf8");
            const packageJson = JSON.parse(data);
            packageJson.scripts.test = "cross-env NODE_ENV=test jest --watchAll";
            fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2), "utf-8");
            console.log(chalk.green("Jest installed successfully"));
        }catch(e){
            console.log(chalk.red(e));
        }
    }

    /**
     * Jest Testing Framework
     * Npm package manager
     * Language: TypeScript
     */
    jestNpmTs(){
        try{
            execSync("npm i jest ts-jest supertest cross-env @types/jest @types/supertest --save-dev", { stdio: "inherit" });
            // update the tsconfig.json file
            const data = fs.readFileSync("tsconfig.json", "utf8");
            const tsconfig = JSON.parse(data);
            tsconfig.compilerOptions.types = ["node", "jest"];
            tsconfig.exclude = ["./coverage", "./dist", "__tests__", "jest.config.js"];
            fs.writeFileSync("tsconfig.json", JSON.stringify(tsconfig, null, 2), "utf-8");
            // add jest.config.js file
            execSync("npx ts-jest config:init", { stdio: "inherit" });
            // update the package.json file
            const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
            packageJson.scripts.test = "cross-env NODE_ENV=test jest --watchAll";
            console.log(chalk.green("Jest installed successfully"));
        }catch(e){
            console.log(chalk.red(e));
        }
    }

    /**
     * Jest Testing Framework
     * Yarn package manager
     * Language: TypeScript
     */
    jestYarnTs(){
        try{
            execSync("yarn add jest ts-jest supertest cross-env @types/jest @types/supertest --dev", { stdio: "inherit" });
            // update the tsconfig.json file
            const data = fs.readFileSync("tsconfig.json", "utf8");
            const tsconfig = JSON.parse(data);
            tsconfig.compilerOptions.types = ["node", "jest"];
            tsconfig.exclude = ["./coverage", "./dist", "__tests__", "jest.config.js"];
            fs.writeFileSync("tsconfig.json", JSON.stringify(tsconfig, null, 2), "utf-8");
            // add jest.config.js file
            execSync("npx ts-jest config:init", { stdio: "inherit" });
            // update the package.json file
            const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
            packageJson.scripts.test = "cross-env NODE_ENV=test jest --watchAll";
            console.log(chalk.green("Jest installed successfully"));
        }catch(e){
            console.log(chalk.red(e));
        }
    }

    /**
     * mocha + chai Testing Framework
     * Npm package manager
     * Language: JavaScript
     */

    mochaNpmJs(){
        try{
            execSync("npm i mocha chai request supertest --save-dev", { stdio: "inherit" });
            // update the package.json file
            const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
            packageJson.scripts.test = "mocha --reporter spec";
            console.log(chalk.green("Mocha installed successfully"));
        }catch(e){
            console.log(chalk.red(e));
        }
    }

    /**
     * mocha + chai Testing Framework
     * Yarn package manager
     * Language: JavaScript
     */
    mochaYarnJs(){
        try{
            execSync("yarn add mocha chai request supertest --dev", { stdio: "inherit" });
            // update the package.json file
            const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
            packageJson.scripts.test = "mocha --reporter spec";
            console.log(chalk.green("Mocha installed successfully"));
        }catch(e){
            console.log(chalk.red(e));
        }
    }

    /**
     * mocha + chai Testing Framework
     * Npm package manager
     * Language: TypeScript
     */
    mochaNpmTs(){
        try{
            execSync("npm i mocha chai request supertest ts-node @types/mocha @types/chai --save-dev", { stdio: "inherit" });
            // update the package.json file
            const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
            packageJson.scripts.test = "mocha --reporter spec --require ts-node/register";
            console.log(chalk.green("Mocha installed successfully"));
        }catch(e){
            console.log(chalk.red(e));
        }
    }

    /**
     * mocha + chai Testing Framework
     * Yarn package manager
     * Language: TypeScript
     */
    mochaYarnTs(){
        try{
            execSync("yarn add mocha chai request supertest ts-node @types/mocha @types/chai --dev", { stdio: "inherit" });
            // update the package.json file
            const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
            packageJson.scripts.test = "mocha --reporter spec --require ts-node/register";
            console.log(chalk.green("Mocha installed successfully"));
        }catch(e){
            console.log(chalk.red(e));
        }
    }

    
}