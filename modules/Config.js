import fs from "fs";
import { execSync } from "child_process";
import chalk from "chalk";
import { highlight } from "cli-highlight";

export default class Config {
    constructor(projectName, projectDescription, projectAuthor, language, packageManager){
        this.projectName = projectName;
        this.projectDescription = projectDescription;
        this.projectAuthor = projectAuthor;
        this.language = language;
        this.packageManager = packageManager;
    }

    // setup the details in the package.json file
    setupDetails(){
        let packageJson = fs.readFileSync("package.json");
        packageJson = JSON.parse(packageJson);
        packageJson.name = this.projectName;
        packageJson.description = this.projectDescription;
        packageJson.author = this.projectAuthor;
        if (this.language === "typescript"){
            packageJson.main = "dist/index.js";
            const buildCommand= packageJson.scripts.build ? "tsc && " + packageJson.scripts.build : "tsc";
            packageJson.scripts = {
                "build": buildCommand,
                "start": "node dist/index.js",
                "dev": "nodemon src/index.ts"
            }
        }else if (this.language === "javascript"){
            packageJson.main = "src/index.js";
            packageJson.scripts = {
                "start": "node src/index.js",
                "dev": "nodemon src/index.js"
            }
        }


        packageJson = JSON.stringify(packageJson, null, 2);
        fs.writeFileSync("package.json", packageJson);
        console.log("✅ Setup Details in Project.");
    }
}