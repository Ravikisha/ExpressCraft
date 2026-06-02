import chalk from "chalk";

const DB_SERVICE = {
  postgresql: `  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: app
    ports:
      - "5432:5432"
    volumes:
      - dbdata:/var/lib/postgresql/data`,
  mysql: `  db:
    image: mysql:8
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: app
    ports:
      - "3306:3306"
    volumes:
      - dbdata:/var/lib/mysql`,
  mongodb: `  db:
    image: mongo:7
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - dbdata:/data/db`,
};

export default class Docker {
  constructor(manifest, { enabled, database }) {
    this.m = manifest;
    this.enabled = enabled;
    this.database = database;
  }

  register() {
    if (!this.enabled) return;
    const m = this.m;
    const start = m.isTs() ? "dist/index.js" : "src/index.js";
    const build = m.isTs() ? "\nRUN npm run build" : "";

    m.addFile(
      "Dockerfile",
      `FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .${build}

EXPOSE 3000
CMD ["node", "${start}"]
`
    );

    m.addFile(
      ".dockerignore",
      `node_modules
npm-debug.log
dist
.env
.git
`
    );

    const service = DB_SERVICE[this.database];
    m.addFile(
      "docker-compose.yml",
      `services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
${service ? "    depends_on:\n      - db\n" : ""}${service ? service + "\n" : ""}${service ? "\nvolumes:\n  dbdata:\n" : ""}`
    );

    m.note("Run in Docker: docker compose up --build");
    console.log(chalk.green("✅ Docker files registered."));
  }
}
