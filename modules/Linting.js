import fs from "fs";
import { execSync } from "child_process";
import chalk from "chalk";
import { highlight } from "cli-highlight";

export default class Linting {
    constructor(linting, packageManager, language) {
        this.linting = linting;
        this.packageManager = packageManager;
        this.language = language;
    }

    /**
     * Package Manager - NPM or Yarn
     * linting - eslint or tslint
     * language - JavaScript or TypeScript
     */

    /**
     * NPM - eslint - JavaScript
     */
    eslintNPM() {
        try {
            execSync("npm install eslint");
            console.log("✅ ESLint installed successfully");
        } catch (err) {
            console.log("❌ Error installing ESLint")
            return
        }
    }

    /**
     * NPM - eslint - TypeScript
     */
    eslintTypeScript() {
        try {
            execSync("npm install eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin");
            console.log("✅ ESLint installed successfully");
        } catch (err) {
            console.log("❌ Error installing ESLint")
            return
        }
    }

    /**
     * NPM - tslint - JavaScript
     */
    tslintNPM() {
        try {
            execSync("npm install tslint");
            console.log("✅ TSLint installed successfully");
        } catch (err) {
            console.log("❌ Error installing TSLint")
            return
        }
    }

    /**
     * NPM - tslint - TypeScript
     */
    tslintTypeScript() {
        try {
            execSync("npm install tslint typescript");
            console.log("✅ TSLint installed successfully");
        } catch (err) {
            console.log("❌ Error installing TSLint")
            return
        }
    }

    /**
     * Yarn - eslint - JavaScript
     */
    eslintYarn() {
        try {
            execSync("yarn add eslint");
            console.log("✅ ESLint installed successfully");
        } catch (err) {
            console.log("❌ Error installing ESLint")
            return
        }
    }

    /**
     * Yarn - eslint - TypeScript
     */
    eslintTypeScriptYarn() {
        try {
            execSync("yarn add eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin");
            console.log("✅ ESLint installed successfully");
        } catch (err) {
            console.log("❌ Error installing ESLint")
            return
        }
    }

    /**
     * Yarn - tslint - JavaScript
     */
    tslintYarn() {
        try {
            execSync("yarn add tslint");
            console.log("✅ TSLint installed successfully");
        } catch (err) {
            console.log("❌ Error installing TSLint")
            return
        }
    }

    /**
     * Yarn - tslint - TypeScript
     */
    tslintTypeScriptYarn() {
        try {
            execSync("yarn add tslint typescript");
            console.log("✅ TSLint installed successfully");
        } catch (err) {
            console.log("❌ Error installing TSLint")
            return
        }
    }

    /**
     * Linting Setup
     */
    setupLinting() {
        if (this.packageManager === "npm" && this.linting === "eslint" && this.language === "javascript") {
            this.eslintNPM();
        } else if (this.packageManager === "npm" && this.linting === "eslint" && this.language === "typescript") {
            this.eslintTypeScript();
        } else if (this.packageManager === "npm" && this.linting === "tslint" && this.language === "javascript") {
            this.tslintNPM();
        } else if (this.packageManager === "npm" && this.linting === "tslint" && this.language === "typescript") {
            this.tslintTypeScript();
        } else if (this.packageManager === "yarn" && this.linting === "eslint" && this.language === "javascript") {
            this.eslintYarn();
        } else if (this.packageManager === "yarn" && this.linting === "eslint" && this.language === "typescript") {
            this.eslintTypeScriptYarn();
        } else if (this.packageManager === "yarn" && this.linting === "tslint" && this.language === "javascript") {
            this.tslintYarn();
        } else if (this.packageManager === "yarn" && this.linting === "tslint" && this.language === "typescript") {
            this.tslintTypeScriptYarn();
        }
    }



}