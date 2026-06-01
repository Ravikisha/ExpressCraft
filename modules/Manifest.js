import VERSIONS from "./versions.js";

/**
 * Manifest — single source of truth for the generated project.
 *
 * Modules REGISTER what they need (deps, devDeps, scripts, config files,
 * code fragments, post-install notes) instead of installing themselves.
 * index.js then writes one package.json + the scaffold and runs a single
 * install at the end.
 */
export default class Manifest {
  constructor({
    name,
    description = "",
    author = "",
    language,
    packageManager,
  }) {
    this.name = name;
    this.description = description;
    this.author = author;
    this.language = language; // "javascript" | "typescript"
    this.packageManager = packageManager; // "npm" | "yarn" | "pnpm"

    // name -> version range
    this.dependencies = new Map();
    this.devDependencies = new Map();

    this.scripts = {};

    // files to write before install: [{ path, content }]
    this.files = [];

    // code fragments contributed to the generated app/server
    this.appImports = []; // import/require lines for src/app
    this.appSetup = []; // lines configuring the express app (app.set/app.use)
    this.serverImports = []; // import/require lines for src/index (server)
    this.bootstrap = []; // async lines before app.listen (e.g. db connect)
    this.env = []; // { key, value, comment }

    // messages shown to the user after install completes
    this.postInstallNotes = [];
  }

  addDep(name, version) {
    if (name)
      this.dependencies.set(name, version || VERSIONS[name] || "latest");
    return this;
  }

  addDevDep(name, version) {
    if (name)
      this.devDependencies.set(name, version || VERSIONS[name] || "latest");
    return this;
  }

  // Add several deps at once. Accepts a space-separated string or array.
  addDeps(list, { dev = false } = {}) {
    const names = Array.isArray(list) ? list : String(list).split(/\s+/);
    names
      .filter(Boolean)
      .forEach((n) => (dev ? this.addDevDep(n) : this.addDep(n)));
    return this;
  }

  setScript(name, command) {
    this.scripts[name] = command;
    return this;
  }

  // Append to an existing script with " && ", or set it if absent.
  appendScript(name, command) {
    this.scripts[name] = this.scripts[name]
      ? `${this.scripts[name]} && ${command}`
      : command;
    return this;
  }

  addFile(path, content) {
    this.files.push({ path, content });
    return this;
  }

  addAppImport(line) {
    if (line && !this.appImports.includes(line)) this.appImports.push(line);
    return this;
  }

  addAppSetup(line) {
    if (line) this.appSetup.push(line);
    return this;
  }

  addServerImport(line) {
    if (line && !this.serverImports.includes(line))
      this.serverImports.push(line);
    return this;
  }

  addBootstrap(line) {
    if (line) this.bootstrap.push(line);
    return this;
  }

  addEnv(key, value = "", comment = "") {
    if (key && !this.env.some((e) => e.key === key))
      this.env.push({ key, value, comment });
    return this;
  }

  note(message) {
    this.postInstallNotes.push(message);
    return this;
  }

  isTs() {
    return this.language === "typescript";
  }

  ext() {
    return this.isTs() ? "ts" : "js";
  }

  // "npm install" | "yarn install" | "pnpm install"
  installCommand() {
    return `${this.packageManager} install`;
  }

  // Proper "run a script" command per package manager.
  // npm needs "run" for custom scripts (but not start/test); yarn/pnpm don't.
  runCommand(script) {
    if (this.packageManager === "yarn" || this.packageManager === "pnpm") {
      return `${this.packageManager} ${script}`;
    }
    return script === "start" || script === "test"
      ? `npm ${script}`
      : `npm run ${script}`;
  }

  // Convert a Map -> plain sorted object for package.json
  static mapToObject(map) {
    return Object.fromEntries(
      [...map.entries()].sort(([a], [b]) => a.localeCompare(b))
    );
  }

  toPackageJson() {
    return {
      name: this.name,
      version: "1.0.0",
      description: this.description,
      author: this.author,
      main: this.isTs() ? "dist/index.js" : "src/index.js",
      type: "commonjs",
      scripts: this.scripts,
      dependencies: Manifest.mapToObject(this.dependencies),
      devDependencies: Manifest.mapToObject(this.devDependencies),
    };
  }
}
