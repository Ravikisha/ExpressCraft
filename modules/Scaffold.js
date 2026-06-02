/**
 * Renders the project source tree from the Manifest:
 *   src/index.(js|ts)   -> server bootstrap (dotenv, db connect, listen)
 *   src/app.(js|ts)     -> express app: base middleware + contributed setup
 *   src/routes/index     -> "/" and "/health"
 *   src/middleware/errorHandler
 *   .env, .env.example
 *
 * Modules contribute via manifest.appImports / appSetup / serverImports /
 * bootstrap / env, so DB, auth and template-engine code lands in the right file.
 */
export default class Scaffold {
  constructor(manifest) {
    this.manifest = manifest;
  }

  register() {
    const m = this.manifest;
    // Base middleware is always present.
    m.addDeps("helmet cors morgan dotenv");
    if (m.isTs()) m.addDeps("@types/cors @types/morgan", { dev: true });
    m.addEnv("PORT", "3000", "Port the server listens on");

    m.addFile(`src/app.${m.ext()}`, this.appFile());
    m.addFile(`src/index.${m.ext()}`, this.serverFile());
    m.addFile(`src/routes/index.${m.ext()}`, this.routesFile());
    m.addFile(`src/controllers/home.${m.ext()}`, this.controllerFile());
    m.addFile(
      `src/middleware/errorHandler.${m.ext()}`,
      this.errorHandlerFile()
    );
    m.addFile(".env", this.envFile());
    m.addFile(".env.example", this.envFile(true));

    console.log("✅ Project scaffold generated.");
  }

  block(lines, indent = "") {
    return lines.length ? lines.map((l) => indent + l).join("\n") + "\n" : "";
  }

  appFile() {
    const m = this.manifest;
    if (m.isTs()) {
      return `import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
${this.block(m.appImports)}import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
${this.block(m.appSetup)}
app.use("/", routes);
app.use(errorHandler);

export default app;
`;
    }
    return `const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
${this.block(m.appImports)}const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
${this.block(m.appSetup)}
app.use("/", routes);
app.use(errorHandler);

module.exports = app;
`;
  }

  serverFile() {
    const m = this.manifest;
    if (m.isTs()) {
      return `import "dotenv/config";
import app from "./app";
${this.block(m.serverImports)}
const port = process.env.PORT || 3000;

async function start(): Promise<void> {
${this.block(m.bootstrap, "  ")}  app.listen(port, () => {
    console.log(\`Server running on port \${port}\`);
  });
}

start();
`;
    }
    return `require("dotenv").config();
const app = require("./app");
${this.block(m.serverImports)}
const port = process.env.PORT || 3000;

async function start() {
${this.block(m.bootstrap, "  ")}  app.listen(port, () => {
    console.log(\`Server running on port \${port}\`);
  });
}

start();
`;
  }

  routesFile() {
    const m = this.manifest;
    if (m.isTs()) {
      return `import { Router } from "express";
import * as home from "../controllers/home";

const router = Router();

router.get("/", home.index);
router.get("/health", home.health);

export default router;
`;
    }
    return `const { Router } = require("express");
const home = require("../controllers/home");

const router = Router();

router.get("/", home.index);
router.get("/health", home.health);

module.exports = router;
`;
  }

  controllerFile() {
    const m = this.manifest;
    const greeting = `Welcome to ${m.name}!`;
    if (m.isTs()) {
      return `import { Request, Response } from "express";

export const index = (_req: Request, res: Response): void => {
  res.json({ message: "${greeting}" });
};

export const health = (_req: Request, res: Response): void => {
  res.json({ status: "ok", uptime: process.uptime() });
};
`;
    }
    return `exports.index = (_req, res) => {
  res.json({ message: "${greeting}" });
};

exports.health = (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
};
`;
  }

  errorHandlerFile() {
    const m = this.manifest;
    if (m.isTs()) {
      return `import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
}
`;
    }
    return `function errorHandler(err, _req, res, _next) {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
}

module.exports = errorHandler;
`;
  }

  envFile(example = false) {
    return (
      this.manifest.env
        .map((e) => {
          const line = `${e.key}=${example ? "" : e.value}`;
          return e.comment ? `# ${e.comment}\n${line}` : line;
        })
        .join("\n") + "\n"
    );
  }
}
