import fs from "fs";
import { execSync } from "child_process";
import chalk from "chalk";
import { highlight } from "cli-highlight";

export default class Documentation{
    constructor(apiDocumentation, packageManager, language){
        this.apiDocumentation = apiDocumentation;
        this.packageManager = packageManager;
        this.language = language;
    }

    /**
     * Package Manager - NPM or Yarn
     * apiDocumentation - Swagger or Postman
     * language - JavaScript or TypeScript
     */

    /**
     * NPM - Swagger - JavaScript
     */
    swaggerNPM(){
        try{
            execSync("npm install swagger-ui-express");
            console.log("✅ Swagger installed successfully");
        }catch(err){
            console.log("❌ Error installing Swagger")
            return
        }
    }

    /**
     * NPM - Swagger - TypeScript
     */
    swaggerTypeScript(){
        try{
            execSync("npm install swagger-ui-express @types/swagger-ui-express");
            console.log("✅ Swagger installed successfully");
        }catch(err){
            console.log("❌ Error installing Swagger")
            return
        }
    }

    /**
     * NPM - Postman - JavaScript
     */
    postmanNPM(){
        try{
            execSync("npm install newman");
            console.log("✅ Postman installed successfully");
        }catch(err){
            console.log("❌ Error installing Postman")
            return
        }
    }

    /**
     * NPM - Postman - TypeScript
     */
    postmanTypeScript(){
        try{
            execSync("npm install newman");
            console.log("✅ Postman installed successfully");
        }catch(err){
            console.log("❌ Error installing Postman")
            return
        }
    }

    /**
     * yarn - Swagger - JavaScript
     */
    swaggerYarn(){
        try{
            execSync("yarn add swagger-ui-express");
            console.log("✅ Swagger installed successfully");
        }catch(err){
            console.log("❌ Error installing Swagger")
            return
        }
    }

    /**
     * yarn - Postman - JavaScript
     */
    postmanYarn(){
        try{
            execSync("yarn add newman");
            console.log("✅ Postman installed successfully");
        }catch(err){
            console.log("❌ Error installing Postman")
            return
        }
    }

    /**
     * Yarn - Swagger - TypeScript
     */
    swaggerYarnTypeScript(){
        try{
            execSync("yarn add swagger-ui-express @types/swagger-ui-express");
            console.log("✅ Swagger installed successfully");
        }catch(err){
            console.log("❌ Error installing Swagger")
            return
        }
    }

    /**
     * Yarn - Postman - TypeScript
     */
    postmanYarnTypeScript(){
        try{
            execSync("yarn add newman");
            console.log("✅ Postman installed successfully");
        }catch(err){
            console.log("❌ Error installing Postman")
            return
        }
    }

    /**
     * Generate API Documentation
     */
    setupDocumentation(){
        if (this.apiDocumentation === "swagger" && this.packageManager === "npm" && this.language === "javascript"){
            this.swaggerNPM()
        }else if(this.apiDocumentation === "swagger" && this.packageManager === "yarn" && this.language === "javascript"){
            this.swaggerYarn()
        }else if(this.apiDocumentation === "swagger" && this.packageManager === "npm" && this.language === "typescript"){
            this.swaggerTypeScript()
        }else if(this.apiDocumentation === "swagger" && this.packageManager === "yarn" && this.language === "typescript"){
            this.swaggerYarnTypeScript()
        }else if(this.apiDocumentation === "postman" && this.packageManager === "npm" && this.language === "javascript"){
            this.postmanNPM()
        }else if(this.apiDocumentation === "postman" && this.packageManager === "yarn" && this.language === "javascript"){
            this.postmanYarn()
        }else if(this.apiDocumentation === "postman" && this.packageManager === "npm" && this.language === "typescript"){
            this.postmanTypeScript()
        }else if(this.apiDocumentation === "postman" && this.packageManager === "yarn" && this.language === "typescript"){
            this.postmanYarnTypeScript()
        }else {
            console.log("🔔 No API Documentation setup")
        }
    }

}