import { execSync } from "child_process";
import chalk from "chalk";

export default class TemplateEngine {
    constructor(templateEngine) {
        this.templateEngine = templateEngine;
    }

    // Template Engine
    createTemplateEngine() {
        if (this.templateEngine === "ejs") {
            this.ejs();
            console.log("✅ EJS initialized successfully.");
        } else if (this.templateEngine === "pug") {
            this.pug();
            console.log("✅ Pug initialized successfully.");
        } else if (this.templateEngine === "twig") {
            this.twig();
            console.log("✅ Twig initialized successfully.");
        } else if (this.templateEngine === "handlebars") {
            this.handlebars();
            console.log("✅ Handlebars initialized successfully.");
        } else if (this.templateEngine === "no template engine") {
            this.noTemplateEngine();
        } else {
            console.log("❌ Please select a template engine.");
            return;
        }
    }

    // EJS
    ejs() {
        try {
            execSync("npm install ejs");
        } catch (err) {
            console.log("❌ Something went wrong to install ejs.");
            return;
        }
    }

    // Pug
    pug() {
        try {
            execSync("npm install pug");
        } catch (err) {
            console.log("❌ Something went wrong to install pug.");
            return;
        }
    }

    // Twig
    twig() {
        try {
            execSync("npm install twig");
        } catch (err) {
            console.log("❌ Something went wrong to install twig.");
            return;
        }
    }

    // Handlebars
    handlebars() {
        try {
            execSync("npm install handlebars");
        } catch (err) {
            console.log("❌ Something went wrong to install handlebars.");
            return;
        }
    }

    // No Template Engine
    noTemplateEngine() {
        console.log(chalk.yellow("🔔 No Template Engine selected."));
    }
}