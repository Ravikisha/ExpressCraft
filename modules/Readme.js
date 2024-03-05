import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class Readme {
    // creating readme
    creatingReadme() {
        const readmeFile = path.resolve(__dirname, "../", "README.md");
        const targetFile = path.resolve(process.cwd(), "README.md");
        try {
            fs.copyFileSync(readmeFile, targetFile);
        }catch(err){
            console.log("❌ Error creating README.md");
            return;
        }
        console.log("✅ README.md created successfully");
    }
}