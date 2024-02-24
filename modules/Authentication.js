import fs from "fs";
import { execSync } from "child_process";
import chalk from "chalk";
import { highlight } from "cli-highlight";

class Authentication {
    constructor(authentication, packageManager, language) {
        this.authentication = authentication;
        this.packageManager = packageManager;
        this.language = language;
    }

    /**
     * Package Manager - NPM or Yarn
     * authentication - passportjs or jwt
     * language - JavaScript or TypeScript
     */

    /**
     * NPM - passportjs - JavaScript
     */

    passportJsNPM() {
        try{
            execSync("npm install passport passport-local");
            execSync("npm install express-session");
            console.log(chalk.green("passportjs dependencies installed successfully"));
        }catch(err){
            console.log(chalk.red("Error installing passportjs dependencies"))
            return
        }
    }

    /**
     * NPM - passportjs - TypeScript
     */
    passportJsTypeScript() {
        try{
            execSync("npm install passport passport-local @types/passport @types/passport-local");
            execSync("npm install express-session");
            console.log(chalk.green("passportjs dependencies installed successfully"));
        }catch(err){
            console.log(chalk.red("Error installing passportjs dependencies"))
            return
        }
    }

    /**
     * NPM - jwt - JavaScript
     */
    jwtNPM() {
        try{
            execSync("npm install jsonwebtoken passport-jwt");
            console.log(chalk.green("jwt dependencies installed successfully"));
        }catch(err){
            console.log(chalk.red("Error installing jwt dependencies"))
            return
        }
    }

    /**
     * NPM - jwt - TypeScript
     */
    jwtTypeScript() {
        try{
            execSync("npm install jsonwebtoken passport-jwt @types/jsonwebtoken @types/passport-jwt");
            console.log(chalk.green("jwt dependencies installed successfully"));
        }catch(err){
            console.log(chalk.red("Error installing jwt dependencies"))
            return
        }
    }

    /**
     * Yarn - passportjs - JavaScript
     */
    passportJsYarn() {
        try{
            execSync("yarn add passport passport-local");
            execSync("yarn add express-session");
            console.log(chalk.green("passportjs dependencies installed successfully"));
        }catch(err){
            console.log(chalk.red("Error installing passportjs dependencies"))
            return
        }
    }

    /**
     * Yarn - passportjs - TypeScript
     */
    passportJsTypeScriptYarn() {
        try{
            execSync("yarn add passport passport-local @types/passport @types/passport-local");
            execSync("yarn add express-session");
            console.log(chalk.green("passportjs dependencies installed successfully"));
        }catch(err){
            console.log(chalk.red("Error installing passportjs dependencies"))
            return
        }
    }

    /**
     * Yarn - jwt - JavaScript
     */
    jwtYarn() {
        try{
            execSync("yarn add jsonwebtoken passport-jwt");
            console.log(chalk.green("jwt dependencies installed successfully"));
        }catch(err){
            console.log(chalk.red("Error installing jwt dependencies"))
            return
        }
    }

    /**
     * Yarn - jwt - TypeScript
     */
    jwtTypeScriptYarn() {
        try{
            execSync("yarn add jsonwebtoken passport-jwt @types/jsonwebtoken @types/passport-jwt");
            console.log(chalk.green("jwt dependencies installed successfully"));
        }catch(err){
            console.log(chalk.red("Error installing jwt dependencies"))
            return
        }
    }

    /**
     * Install dependencies based on user's selection
     */
    setupAuth(){
        if(this.packageManager === "NPM" && this.authentication === "passportjs" && this.language === "JavaScript"){
            this.passportJsNPM();
        }else if(this.packageManager === "NPM" && this.authentication === "passportjs" && this.language === "TypeScript"){
            this.passportJsTypeScript();
        }else if(this.packageManager === "NPM" && this.authentication === "jwt" && this.language === "JavaScript"){
            this.jwtNPM();
        }else if(this.packageManager === "NPM" && this.authentication === "jwt" && this.language === "TypeScript"){
            this.jwtTypeScript();
        }else if(this.packageManager === "Yarn" && this.authentication === "passportjs" && this.language === "JavaScript"){
            this.passportJsYarn();
        }else if(this.packageManager === "Yarn" && this.authentication === "passportjs" && this.language === "TypeScript"){
            this.passportJsTypeScriptYarn();
        }else if(this.packageManager === "Yarn" && this.authentication === "jwt" && this.language === "JavaScript"){
            this.jwtYarn();
        }else if(this.packageManager === "Yarn" && this.authentication === "jwt" && this.language === "TypeScript"){
            this.jwtTypeScriptYarn();
        }
    }

}