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
   * Database = "MySQL", "PostgreSQL", "SQLite", "MongoDB",  "No Database"
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

      console.log("Run the following command to generate the database schema:");
      console.log(highlight("npx prisma generate", { language: "bash" }));
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

      console.log("Run the following command to generate the database schema:");
      console.log(highlight("npx prisma generate", { language: "bash" }));
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

      console.log("Run the following command to generate the database schema:");
      console.log(highlight("npx prisma generate", { language: "bash" }));
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
   * Database = "MySQL"
   * ORM = "Prisma"
   */
  prismaMySQLYarn() {
    try {
      execSync("yarn add @prisma/client prisma");
      execSync("npx prisma init --datasource-provider=mysql");

      console.log("Run the following command to generate the database schema:");
      console.log(highlight("npx prisma generate", { language: "bash" }));
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

      console.log("Run the following command to generate the database schema:");
      console.log(highlight("npx prisma generate", { language: "bash" }));
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

      console.log("Run the following command to generate the database schema:");
      console.log(highlight("npx prisma generate", { language: "bash" }));
    } catch (err) {
      console.log(chalk.red("Something went wrong to install prisma."));
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
      execSync("npm install sequelize @types/sequelize sequelize-typescript");
      switch (this.database) {
        case "mysql":
          execSync("npm install mysql2");
          break;
        case "postgresql":
          execSync("npm install pg pg-hstore");
          break;
        case "sqlite":
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
   * Language = javascript
   * Package Manager = yarn
   * Database = "MySQL", "PostgreSQL", "SQLite",
   * ORM = "Sequelize"
   */
  sequelizeYarnJs() {
    try {
      execSync("yarn add sequelize");
      switch (this.database) {
        case "MySQL":
          execSync("yarn add mysql2");
          break;
        case "PostgreSQL":
          execSync("yarn add pg pg-hstore");
          break;
        case "SQLite":
          execSync("yarn add sqlite3");
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
   * Package Manager = yarn
   * Database = "MySQL", "PostgreSQL", "SQLite",
   * ORM = "Sequelize"
   */
  sequelizeYarnTs() {
    try {
      execSync("yarn add sequelize @types/sequelize sequelize-typescript");
      switch (this.database) {
        case "mysql":
          execSync("yarn add mysql2");
          break;
        case "postgresql":
          execSync("yarn add pg pg-hstore");
          break;
        case "sqlite":
          execSync("yarn add sqlite3");
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
   * Language = javascript/typescript
   * Package Manager = npm
   * Database = "MySQL", "PostgreSQL", "SQLite",
   * ORM = "TypeORM"
   */
  typeORMNpm() {
    try {
      execSync("npm install typeorm reflect-metadata");
      switch (this.database) {
        case "mysql":
          execSync("npm install mysql");
          break;
        case "postgresql":
          execSync("npm install pg");
          break;
        case "sqlite":
          execSync("npm install sqlite3");
          break;
        default:
          console.log(chalk.red("Unsupported database."));
          return;
      }
    } catch (err) {
      console.log(chalk.red("Something went wrong to install typeorm."));
      return;
    }
  }

  /**
   * Language = javascript/typescript
   * Package Manager = yarn
   * Database = "MySQL", "PostgreSQL", "SQLite",
   * ORM = "TypeORM"
   */
  typeORMYarn() {
    try {
      execSync("yarn add typeorm reflect-metadata");
      switch (this.database) {
        case "mysql":
          execSync("yarn add mysql");
          break;
        case "postgresql":
          execSync("yarn add pg");
          break;
        case "sqlite":
          execSync("yarn add sqlite3");
          break;
        default:
          console.log(chalk.red("Unsupported database."));
          return;
      }
    } catch (err) {
      console.log(chalk.red("Something went wrong to install typeorm."));
      return;
    }
  }

  /**
   * Language = javascript/typescript
   * Package Manager = npm
   * Database = mysql, postgresql, sqlite
   * ORM = "Drizzle ORM"
   */

  drizzleORMNpm() {
    try {
      execSync("npm install drizzle-orm");
      execSync("npm install drizzle-kit -D");
      switch (this.database) {
        case "mysql":
          execSync("npm install mysql");
          break;
        case "postgresql":
          execSync("npm install pg");
          break;
        case "sqlite":
          execSync("npm install sqlite3");
          break;
        default:
          console.log(chalk.red("Unsupported database."));
          return;
      }
    } catch (err) {
      console.log(chalk.red("Something went wrong to install drizzle-orm."));
      return;
    }
  }

  /**
   * Language = javascript/typescript
   * Package Manager = yarn
   * Database = mysql, postgresql, sqlite
   * ORM = "Drizzle ORM"
   */

  drizzleORMYarn() {
    try {
      execSync("yarn add drizzle-orm");
      execSync("yarn add drizzle-kit -D");
      switch (this.database) {
        case "mysql":
          execSync("yarn add mysql");
          break;
        case "postgresql":
          execSync("yarn add pg");
          break;
        case "sqlite":
          execSync("yarn add sqlite3");
          break;
        default:
          console.log(chalk.red("Unsupported database."));
          return;
      }
    } catch (err) {
      console.log(chalk.red("Something went wrong to install drizzle-orm."));
      return;
    }
  }

  /**
   * Language = javascript/typescript
   * Package Manager = npm
   * Database = "No Database"
   * ORM = "No ORM"
   */
  noDatabaseNoORM() {
    console.log(chalk.yellow("No database and ORM selected."));
  }

  /**
   * Mapping function to map the database and ORM to the respective functions.
   */
  databaseSetup() {
    switch (this.language) {
      case "javascript":
        switch (this.packageManager) {
          case "npm":
            switch (this.database) {
              case "mysql":
                switch (this.orm) {
                  case "prisma":
                    this.prismaMySQLNpm();
                    break;
                  case "sequelize":
                    this.sequelizeNpmJs();
                    break;
                  case "typeorm":
                    this.typeORMNpm();
                    break;
                  case "drizzle-orm":
                    this.drizzleORMNpm();
                    break;
                  case "no orm":
                    this.noDatabaseNoORM();
                    break;
                  default:
                    console.log(chalk.red("Unsupported ORM."));
                    return;
                }
                break;
              case "postgresql":
                switch (this.orm) {
                  case "prisma":
                    this.prismaPostgreSQLNpm();
                    break;
                  case "sequelize":
                    this.sequelizeNpmJs();
                    break;
                  case "typeorm":
                    this.typeORMNpm();
                    break;
                  case "drizzle-orm":
                    this.drizzleORMNpm();
                    break;
                  case "no orm":
                    this.noDatabaseNoORM();
                    break;
                  default:
                    console.log(chalk.red("Unsupported ORM."));
                    return;
                }
                break;
              case "sqlite":
                switch (this.orm) {
                  case "prisma":
                    this.prismaSQLiteNpm();
                    break;
                  case "sequelize":
                    this.sequelizeNpmJs();
                    break;
                  case "typeorm":
                    this.typeORMNpm();
                    break;
                  case "drizzle-orm":
                    this.drizzleORMNpm();
                    break;
                  case "no orm":
                    this.noDatabaseNoORM();
                    break;
                  default:
                    console.log(chalk.red("Unsupported ORM."));
                    return;
                }
                break;
              case "mongodb":
                switch (this.orm) {
                  case "mongoose":
                    this.mongooseNpm();
                    break;
                  case "no orm":
                    this.noDatabaseNoORM();
                    break;
                  default:
                    console.log(chalk.red("Unsupported ORM."));
                    return;
                }
                break;
              default:
                console.log(chalk.red("Unsupported database."));
                return;
            }
            break;
          case "yarn":
            switch (this.database) {
              case "mysql":
                switch (this.orm) {
                  case "prisma":
                    this.prismaMySQLYarn();
                    break;
                  case "sequelize":
                    this.sequelizeYarnJs();
                    break;
                  case "typeorm":
                    this.typeORMYarn();
                    break;
                  case "drizzle-orm":
                    this.drizzleORMYarn();
                    break;
                  case "no orm":
                    this.noDatabaseNoORM();
                    break;
                  default:
                    console.log(chalk.red("Unsupported ORM."));
                    return;
                }
                break;
              case "postgresql":
                switch (this.orm) {
                  case "prisma":
                    this.prismaPostgreSQLYarn();
                    break;
                  case "sequelize":
                    this.sequelizeYarnJs();
                    break;
                  case "typeorm":
                    this.typeORMYarn();
                    break;
                  case "drizzle-orm":
                    this.drizzleORMYarn();
                    break;
                  case "no orm":
                    this.noDatabaseNoORM();
                    break;
                  default:
                    console.log(chalk.red("Unsupported ORM."));
                    return;
                }
                break;
              case "sqlite":
                switch (this.orm) {
                  case "prisma":
                    this.prismaSQLiteYarn();
                    break;
                  case "sequelize":
                    this.sequelizeYarnJs();
                    break;
                  case "typeorm":
                    this.typeORMYarn();
                    break;
                  case "drizzle-orm":
                    this.drizzleORMYarn();
                    break;
                  case "no orm":
                    this.noDatabaseNoORM();
                    break;
                  default:
                    console.log(chalk.red("Unsupported ORM."));
                    return;
                }
                break;
              case "mongodb":
                switch (this.orm) {
                  case "mongoose":
                    this.mongooseYarn();
                    break;
                  case "no orm":
                    this.noDatabaseNoORM();
                    break;
                  default:
                    console.log(chalk.red("Unsupported ORM."));
                    return;
                }
                break;
              default:
                console.log(chalk.red("Unsupported database."));
                return;
            }
            break;
          default:
            console.log(chalk.red("Unsupported package manager."));
            return;
        }
        break;
      case "typescript":
        switch (this.packageManager) {
          case "npm":
            switch (this.database) {
              case "mysql":
                switch (this.orm) {
                  case "prisma":
                    this.prismaMySQLNpm();
                    break;
                  case "sequelize":
                    this.sequelizeNpmTs();
                    break;
                  case "typeorm":
                    this.typeORMNpm();
                    break;
                  case "drizzle-orm":
                    this.drizzleORMNpm();
                    break;
                  case "no orm":
                    this.noDatabaseNoORM();
                    break;
                  default:
                    console.log(chalk.red("Unsupported ORM."));
                    return;
                }
                break;
              case "postgresql":
                switch (this.orm) {
                  case "prisma":
                    this.prismaPostgreSQLNpm();
                    break;
                  case "sequelize":
                    this.sequelizeNpmTs();
                    break;
                  case "typeorm":
                    this.typeORMNpm();
                    break;
                  case "drizzle-orm":
                    this.drizzleORMNpm();
                    break;
                  case "no orm":
                    this.noDatabaseNoORM();
                    break;
                  default:
                    console.log(chalk.red("Unsupported ORM."));
                    return;
                }
                break;
              case "sqlite":
                switch (this.orm) {
                  case "prisma":
                    this.prismaSQLiteNpm();
                    break;
                  case "sequelize":
                    this.sequelizeNpmTs();
                    break;
                  case "typeorm":
                    this.typeORMNpm();
                    break;
                  case "drizzle-orm":
                    this.drizzleORMNpm();
                    break;
                  case "no orm":
                    this.noDatabaseNoORM();
                    break;
                  default:
                    console.log(chalk.red("Unsupported ORM."));
                    return;
                }
                break;
              case "mongodb":
                switch (this.orm) {
                  case "mongoose":
                    this.mongooseNpm();
                    break;
                  case "no orm":
                    this.noDatabaseNoORM();
                    break;
                  default:
                    console.log(chalk.red("Unsupported ORM."));
                    return;
                }
                break;
              default:
                console.log(chalk.red("Unsupported database."));
                return;
            }
            break;
          case "yarn":
            switch (this.database) {
              case "mysql":
                switch (this.orm) {
                  case "prisma":
                    this.prismaMySQLYarn();
                    break;
                  case "sequelize":
                    this.sequelizeYarnTs();
                    break;
                  case "typeorm":
                    this.typeORMYarn();
                    break;
                  case "drizzle-orm":
                    this.drizzleORMYarn();
                    break;
                  case "no orm":
                    this.noDatabaseNoORM();
                    break;
                  default:
                    console.log(chalk.red("Unsupported ORM."));
                    return;
                }
                break;
              case "postgresql":
                switch (this.orm) {
                  case "prisma":
                    this.prismaPostgreSQLYarn();
                    break;
                  case "sequelize":
                    this.sequelizeYarnTs();
                    break;
                  case "typeorm":
                    this.typeORMYarn();
                    break;
                  case "drizzle-orm":
                    this.drizzleORMYarn();
                    break;
                  case "no orm":
                    this.noDatabaseNoORM();
                    break;
                  default:
                    console.log(chalk.red("Unsupported ORM."));
                    return;
                }
                break;
              case "sqlite":
                switch (this.orm) {
                  case "prisma":
                    this.prismaSQLiteYarn();
                    break;
                  case "sequelize":
                    this.sequelizeYarnTs();
                    break;
                  case "typeorm":
                    this.typeORMYarn();
                    break;
                  case "drizzle-orm":
                    this.drizzleORMYarn();
                    break;
                  case "no orm":
                    this.noDatabaseNoORM();
                    break;
                  default:
                    console.log(chalk.red("Unsupported ORM."));
                    return;
                }
                break;
              case "mongodb":
                switch (this.orm) {
                  case "mongoose":
                    this.mongooseYarn();
                    break;
                  case "no orm":
                    this.noDatabaseNoORM();
                    break;
                  default:
                    console.log(chalk.red("Unsupported ORM."));
                    return;
                }
                break;
              default:
                console.log(chalk.red("Unsupported database."));
                return;
            }
            break;
          default:
            console.log(chalk.red("Unsupported package manager."));
            return;
        }
        break;
      default:
        console.log(chalk.red("Unsupported language."));
        return;
    }
    console.log(chalk.green("Database and ORM setup complete."));
  }
}
