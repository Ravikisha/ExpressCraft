import chalk from "chalk";

// SQL driver package per database, per ORM (drizzle/prisma differ slightly).
const SQL_DRIVERS = {
  default: {
    mysql: ["mysql2"],
    postgresql: ["pg", "pg-hstore"],
    sqlite: ["sqlite3"],
  },
  typeorm: { mysql: ["mysql2"], postgresql: ["pg"], sqlite: ["sqlite3"] },
  "drizzle-orm": {
    mysql: ["mysql2"],
    postgresql: ["pg"],
    sqlite: ["better-sqlite3"],
  },
};

const SEQUELIZE_DIALECT = {
  mysql: "mysql",
  postgresql: "postgres",
  sqlite: "sqlite",
};

const TYPEORM_TYPE = {
  mysql: "mysql",
  postgresql: "postgres",
  sqlite: "sqlite",
};

export default class DatabaseSetup {
  constructor(manifest, database, orm) {
    this.manifest = manifest;
    this.database = database;
    this.orm = orm;
  }

  register() {
    const { database, orm } = this;
    if (database === "no database" || orm === "no orm") {
      console.log(chalk.yellow("🔔 No database / ORM selected."));
      return;
    }

    switch (orm) {
      case "prisma":
        return this.prisma();
      case "sequelize":
        return this.sequelize();
      case "typeorm":
        return this.typeorm();
      case "drizzle-orm":
        return this.drizzle();
      case "mongoose":
        return this.mongoose();
      default:
        console.log("❌ Unsupported ORM.");
    }
  }

  sqlDrivers(ormKey = "default") {
    const table = SQL_DRIVERS[ormKey] || SQL_DRIVERS.default;
    const drivers = table[this.database];
    if (!drivers) {
      console.log(`❌ ${this.orm} does not support "${this.database}".`);
      return [];
    }
    return drivers;
  }

  configPath() {
    return `src/config/db.${this.manifest.ext()}`;
  }

  prisma() {
    const m = this.manifest;
    m.addDep("@prisma/client").addDevDep("prisma");
    const provider =
      this.database === "postgresql" ? "postgresql" : this.database;
    m.addEnv(
      "DATABASE_URL",
      this.database === "sqlite" ? "file:./dev.db" : "",
      "Prisma datasource connection string"
    );

    const file = m.isTs()
      ? `import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
`
      : `const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = prisma;
`;
    m.addFile(`src/config/prisma.${m.ext()}`, file);
    m.note(
      `Initialize Prisma: npx prisma init --datasource-provider=${provider}, then npx prisma migrate dev.`
    );
    console.log("✅ Prisma registered.");
  }

  sequelize() {
    const m = this.manifest;
    m.addDep("sequelize");
    if (m.isTs())
      m.addDevDep("@types/sequelize").addDep("sequelize-typescript");
    this.sqlDrivers("default").forEach((d) => m.addDep(d));

    const dialect = SEQUELIZE_DIALECT[this.database];
    const init =
      this.database === "sqlite"
        ? `new Sequelize({ dialect: "sqlite", storage: process.env.DATABASE_URL || "./data.sqlite", logging: false })`
        : `new Sequelize(process.env.DATABASE_URL as string, { dialect: "${dialect}", logging: false })`;
    const initJs = init.replace(" as string", "");

    if (this.database !== "sqlite")
      m.addEnv("DATABASE_URL", "", "Sequelize connection string");

    m.addFile(
      this.configPath(),
      m.isTs()
        ? `import { Sequelize } from "sequelize";

const sequelize = ${init};

export default sequelize;
`
        : `const { Sequelize } = require("sequelize");

const sequelize = ${initJs};

module.exports = sequelize;
`
    );
    this.wireSql("sequelize", "await sequelize.authenticate();");
    console.log("✅ Sequelize registered.");
  }

  typeorm() {
    const m = this.manifest;
    m.addDep("typeorm").addDep("reflect-metadata");
    this.sqlDrivers("typeorm").forEach((d) => m.addDep(d));
    const type = TYPEORM_TYPE[this.database];
    if (this.database !== "sqlite")
      m.addEnv("DATABASE_URL", "", "TypeORM connection string");

    const opts =
      this.database === "sqlite"
        ? `{ type: "sqlite", database: process.env.DATABASE_URL || "./data.sqlite", entities: [], synchronize: true }`
        : `{ type: "${type}", url: process.env.DATABASE_URL, entities: [], synchronize: true }`;

    m.addFile(
      `src/config/data-source.${m.ext()}`,
      m.isTs()
        ? `import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource(${opts});
`
        : `require("reflect-metadata");
const { DataSource } = require("typeorm");

const AppDataSource = new DataSource(${opts});

module.exports = { AppDataSource };
`
    );
    if (m.isTs())
      m.addServerImport(
        `import { AppDataSource } from "./config/data-source";`
      );
    else
      m.addServerImport(
        `const { AppDataSource } = require("./config/data-source");`
      );
    m.addBootstrap("await AppDataSource.initialize();");
    m.addBootstrap('console.log("Data source initialized");');
    console.log("✅ TypeORM registered.");
  }

  drizzle() {
    const m = this.manifest;
    m.addDep("drizzle-orm").addDevDep("drizzle-kit");
    this.sqlDrivers("drizzle-orm").forEach((d) => m.addDep(d));
    m.addEnv(
      "DATABASE_URL",
      this.database === "sqlite" ? "./data.sqlite" : "",
      "Drizzle connection string"
    );
    m.note(
      "Define your Drizzle schema in src/db/schema and configure drizzle.config for migrations."
    );
    console.log("✅ Drizzle ORM registered.");
  }

  mongoose() {
    const m = this.manifest;
    if (this.database !== "mongodb") {
      console.log("❌ Mongoose requires MongoDB.");
      return;
    }
    m.addDep("mongoose");
    m.addEnv(
      "MONGO_URI",
      "mongodb://localhost:27017/" + m.name,
      "MongoDB connection string"
    );
    m.addFile(
      this.configPath(),
      m.isTs()
        ? `import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log("MongoDB connected");
}
`
        : `const mongoose = require("mongoose");

async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
}

module.exports = { connectDB };
`
    );
    if (m.isTs()) m.addServerImport(`import { connectDB } from "./config/db";`);
    else m.addServerImport(`const { connectDB } = require("./config/db");`);
    m.addBootstrap("await connectDB();");
    console.log("✅ Mongoose registered.");
  }

  // Shared wiring for SQL ORMs that export a default instance from config/db.
  wireSql(varName, bootstrapLine) {
    const m = this.manifest;
    if (m.isTs()) m.addServerImport(`import ${varName} from "./config/db";`);
    else m.addServerImport(`const ${varName} = require("./config/db");`);
    m.addBootstrap(bootstrapLine);
    m.addBootstrap(`console.log("Database connected");`);
  }
}
