import fs from "fs";
import path from "path";
import { execSync } from "child_process";

/**
 * Inspects the current working directory to understand an existing project,
 * so `expresscraft add` can augment it without re-asking the obvious.
 */
export default class ProjectContext {
  constructor(data) {
    Object.assign(this, data);
  }

  static detect(cwd = process.cwd()) {
    const pkgPath = path.join(cwd, "package.json");
    if (!fs.existsSync(pkgPath)) {
      throw new Error(
        "No package.json found here. Run `expresscraft add` inside a project, or use `expresscraft create`."
      );
    }

    let pkg;
    try {
      pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    } catch (e) {
      throw new Error(`Could not parse package.json: ${e.message}`);
    }

    return new ProjectContext({
      cwd,
      pkg,
      name: pkg.name || path.basename(cwd),
      dependencies: pkg.dependencies || {},
      devDependencies: pkg.devDependencies || {},
      scripts: pkg.scripts || {},
      packageManager: ProjectContext.detectPm(cwd),
      language: ProjectContext.detectLanguage(cwd, pkg),
      entryFile: ProjectContext.detectEntry(cwd, pkg),
      gitDirty: ProjectContext.detectGitDirty(cwd),
      envKeys: ProjectContext.readEnvKeys(cwd),
    });
  }

  static detectPm(cwd) {
    if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
    if (fs.existsSync(path.join(cwd, "yarn.lock"))) return "yarn";
    if (fs.existsSync(path.join(cwd, "package-lock.json"))) return "npm";
    return "npm";
  }

  static detectLanguage(cwd, pkg) {
    if (fs.existsSync(path.join(cwd, "tsconfig.json"))) return "typescript";
    if (pkg.devDependencies?.typescript || pkg.dependencies?.typescript)
      return "typescript";
    if (typeof pkg.main === "string" && pkg.main.endsWith(".ts"))
      return "typescript";
    return "javascript";
  }

  static detectEntry(cwd, pkg) {
    const candidates = [
      pkg.main,
      "src/index.ts",
      "src/index.js",
      "src/app.ts",
      "src/app.js",
      "src/server.ts",
      "src/server.js",
      "index.ts",
      "index.js",
      "app.js",
      "server.js",
    ].filter(Boolean);
    for (const c of candidates) {
      if (fs.existsSync(path.join(cwd, c))) return c;
    }
    return null;
  }

  static detectGitDirty(cwd) {
    try {
      const out = execSync("git status --porcelain", {
        cwd,
        stdio: ["ignore", "pipe", "ignore"],
      })
        .toString()
        .trim();
      return out.length > 0;
    } catch {
      return false; // not a git repo (or git missing)
    }
  }

  static readEnvKeys(cwd) {
    const envPath = path.join(cwd, ".env");
    if (!fs.existsSync(envPath)) return new Set();
    const keys = new Set();
    for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=/);
      if (m) keys.add(m[1]);
    }
    return keys;
  }

  hasDep(name) {
    return name in this.dependencies || name in this.devDependencies;
  }
}
