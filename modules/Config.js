import fs from "fs";
import { execSync } from "child_process";
import chalk from "chalk";
import { highlight } from "cli-highlight";

export default class Config {
    constructor(projectName, projectDescription, projectAuthor){
        this.projectName = projectName;
        this.projectDescription = projectDescription;
        this.projectAuthor = projectAuthor;
    }

    // setup the details in the package.json file
    setupDetails(){
        let packageJson = fs.readFileSync("package.json");
        packageJson = JSON.parse(packageJson);
        packageJson.name = this.projectName;
        packageJson.description = this.projectDescription;
        packageJson.author = this.projectAuthor;
        packageJson.script = {
            "start": "node index.js",
            "dev": "nodemon index.js"
        }
        packageJson = JSON.stringify(packageJson, null, 2);
        fs.writeFileSync("package.json", packageJson);
        console.log("✅ Setup Details in Project.");
    }
}