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
   * Language = javascript/typescript
   * Package Manager = npm
   * Database = "MySQL"
   * ORM = "Prisma"
   */
  prismaMySQLNpm() {
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
   * Language = javascript/typescript
   * Package Manager = npm
   * Database = "PostgreSQL"
   * ORM = "Prisma"
   */
  prismaPostgreSQLNpm() {
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
   * Language = javascript/typescript
   * Package Manager = npm
   * Database = "SQLite"
   * ORM = "Prisma"
   */
  prismaSQLiteNpm() {
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
   * Language = javascript/typescript
   * Package Manager = npm
   * Database = "MongoDB"
   * ORM = "Mongoose"
   */
  mongooseNpm() {
    try {
      execSync("npm install mongoose");
    } catch (err) {
      console.log(chalk.red("Something went wrong to install mongoose."));
      return;
    }
  }

  /**
   * Language = javascript/typescript
   * Package Manager = npm
   * Database = "Firebase"
   * ORM = "No ORM"
   */
  firebaseNpm() {
    try {
      execSync("npm install firebase");
    } catch (err) {
      console.log(chalk.red("Something went wrong to install firebase."));
      return;
    }
  }

  /**
   * Language = javascript/typescript
   * Package Manager = yarn
   * Database = "MySQL"
   * ORM = "Prisma"
   */
  prismaMySQLYarn() {
    try {
      execSync("yarn add @prisma/client prisma");
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
   * Language = javascript/typescript
   * Package Manager = yarn
   * Database = "PostgreSQL"
   * ORM = "Prisma"
   */
  prismaPostgreSQLYarn() {
    try {
      execSync("yarn add @prisma/client prisma");
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
   * Language = javascript/typescript
   * Package Manager = yarn
   * Database = "SQLite"
   * ORM = "Prisma"
   */
  prismaSQLiteYarn() {
    try {
      execSync("yarn add @prisma/client prisma");
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
   * Language = javascript/typescript
   * Package Manager = yarn
   * Database = "MongoDB"
   * ORM = "Mongoose"
   */
  mongooseYarn() {
    try {
      execSync("yarn add mongoose");
    } catch (err) {
      console.log(chalk.red("Something went wrong to install mongoose."));
      return;
    }
  }

  /**
   * Language = javascript/typescript
   * Package Manager = yarn
   * Database = "Firebase"
   * ORM = "No ORM"
   */
  firebaseYarn() {
    try {
      execSync("yarn add firebase");
    } catch (err) {
      console.log(chalk.red("Something went wrong to install firebase."));
      return;
    }
  }

  /**
   * Language = javascript
   * Package Manager = npm
   * Database = "MySQL", "PostgreSQL", "SQLite",
   * ORM = "Sequelize"
   */

  sequelizeNpmJs() {
    try {
      execSync("npm install sequelize");
      switch (this.database) {
        case "MySQL":
          execSync("npm install mysql2");
          break;
        case "PostgreSQL":
          execSync("npm install pg pg-hstore");
          break;
        case "SQLite":
          execSync("npm install sqlite3");
          break;
        default:
          console.log(chalk.red("Unsupported database."));
          return;
      }
    } catch (err) {
      console.log(chalk.red("Something went wrong to install sequelize."));
      return;
    }
  }

  /**
   * Language = typescript
   * Package Manager = npm
   * Database = "MySQL", "PostgreSQL", "SQLite",
   * ORM = "Sequelize"
   */
  sequelizeNpmTs() {
    try {
      execSync("npm install sequelize @types/sequelize");
      switch (this.database) {
        case "MySQL":
          execSync("npm install mysql2");
          break;
        case "PostgreSQL":
          execSync("npm install pg pg-hstore");
          break;
        case "SQLite":
          execSync("npm install sqlite3");
          break;
        default:
          console.log(chalk.red("Unsupported database."));
          return;
      }
    } catch (err) {
      console.log(chalk.red("Something went wrong to install sequelize."));
      return;
    }
  }
}
