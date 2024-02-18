import fs from "fs";
import { execSync } from "child_process";
import chalk from "chalk";
import { highlight } from "cli-highlight";

export default class DatabaseSetup {
  constructor(packageManager, projectName, database, language, orm) {
    this.packageManager = packageManager;
    this.projectName = projectName;
    this.database = database;
    this.language = language;
    this.orm = orm;
  }

  /**
   * This function creates the project folder and initializes it with the package manager.
   * Language = javascript/typescript
   * Package Manager = npm/yarn
   * Database = "MySQL", "PostgreSQL", "SQLite", "MongoDB", "Firebase", "No Database"
   * ORM = "Prisma", "Sequelize", "TypeORM", "Mongoose", "Drizzle ORM", "No ORM"
   */

  /**
   * Language = javascript
   * Package Manager = npm
   * Database = "MySQL"
   * ORM = "Prisma"
   */
  prismaMySQLNpmJs() {
    try {
      execSync("npm install @prisma/client prisma");
      execSync("npx prisma init --datasource-provider=mysql");
      execSync("npx prisma generate");
      console.log("Run the following command to pull the database schema:");
      console.log(highlight("npx prisma db pull", { language: "bash" }));
    } catch (err) {
      console.log(chalk.red("Something went wrong to install prisma."));
      return;
    }
  }

  /**
   * Language = javascript
   * Package Manager = npm
   * Database = "PostgreSQL"
   * ORM = "Prisma"
   */
  prismaPostgreSQLNpmJs() {
    try {
      execSync("npm install @prisma/client prisma");
      execSync("npx prisma init --datasource-provider=postgresql");
      execSync("npx prisma generate");
      console.log("Run the following command to pull the database schema:");
      console.log(highlight("npx prisma db pull", { language: "bash" }));
    } catch (err) {
      console.log(chalk.red("Something went wrong to install prisma."));
      return;
    }
  }

  /**
   * Language = javascript
   * Package Manager = npm
   * Database = "SQLite"
   * ORM = "Prisma"
   */
  prismaSQLiteNpmJs() {
    try {
      execSync("npm install @prisma/client prisma");
      execSync("npx prisma init --datasource-provider=sqlite");
      execSync("npx prisma generate");
      console.log("Run the following command to pull the database schema:");
      console.log(highlight("npx prisma db pull", { language: "bash" }));
    } catch (err) {
      console.log(chalk.red("Something went wrong to install prisma."));
      return;
    }
  }

    /**
     * Language = javascript
     * Package Manager = npm
     * Database = "MongoDB"
     * ORM = "Mongoose"
     */
    mongooseNpmJs() {
        try {
            execSync("npm install mongoose");
        } catch (err) {
            console.log(chalk.red("Something went wrong to install mongoose."));
            return;
        }
    }

    /**
     * Language = javascript
     * Package Manager = npm
     * Database = "Firebase"
     * ORM = "No ORM"
     */
    firebaseNpmJs() {
        try {
            execSync("npm install firebase");
        } catch (err) {
            console.log(chalk.red("Something went wrong to install firebase."));
            return;
        }
    }

    
}
