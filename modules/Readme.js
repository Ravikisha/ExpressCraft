import { execSync } from "child_process";
import fs from "fs";

export default class Readme {
    // creating readme
    creatingReadme() {
        const readmeContent = fs.readFileSync("README.md", "utf-8");
        fs.writeFileSync("readme.md", readmeContent);
        console.log("✅ Readme created successfully.");
    }
}