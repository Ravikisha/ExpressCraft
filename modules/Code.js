import { execSync } from "child_process";
import fs from "fs";

export default class Code {
    constructor(language, packageManager){
        this.language = language;
        this.packageManager = packageManager;
    }

    /**
     * Create a src folder and create a index file
     */
    createSrcFolder(){
        fs.mkdirSync("src");
        if (this.language === "typescript"){
            fs.writeFileSync("src/index.ts", "");
        }else if (this.language === "javascript"){
            fs.writeFileSync("src/index.js", "");
        }else{
            console.log("❌ Language not supported");
            return
        }
    }
}