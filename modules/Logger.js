import chalk from "chalk";

/**
 * Structured HTTP logging with pino. Contributes a middleware fragment so it
 * lands in the generated app (create mode) or the setup guide (add mode).
 */
export default class Logger {
  constructor(manifest, { enabled }) {
    this.m = manifest;
    this.enabled = enabled;
  }

  register() {
    if (!this.enabled) return;
    const m = this.m;
    m.addDep("pino").addDep("pino-http");
    m.addDevDep("pino-pretty");

    if (m.isTs()) m.addAppImport(`import pinoHttp from "pino-http";`);
    else m.addAppImport(`const pinoHttp = require("pino-http");`);
    m.addAppSetup(`app.use(pinoHttp());`);

    m.note("Pretty logs in dev: pipe your start command through pino-pretty.");
    console.log(chalk.green("✅ Pino logger registered."));
  }
}
