import fs from "fs";
import path from "path";

/**
 * Phase 3 — best-effort wiring into an existing entry file.
 *
 * Injects only the SAFE, synchronous fragments:
 *   - import/require lines (after the last existing import)
 *   - app.use(...) / app.set(...) middleware (after the last existing app.use/set,
 *     or right after `const app = express()`)
 *
 * Bootstrap lines (`await connectDB()` etc.) are intentionally NOT injected —
 * placing `await` correctly needs an async context we can't guarantee — so they
 * stay in EXPRESSCRAFT_SETUP.md. The target file is backed up to <file>.bak.
 * Any uncertainty → that group is skipped and falls back to the setup guide.
 */
export default class Injector {
  constructor(ctx) {
    this.ctx = ctx;
  }

  candidateFiles() {
    const ext = this.ctx.language === "typescript" ? "ts" : "js";
    const list = [
      this.ctx.entryFile,
      `src/app.${ext}`,
      `src/index.${ext}`,
      "app.js",
      "server.js",
      "index.js",
    ].filter(Boolean);
    const seen = new Set();
    const out = [];
    for (const f of list) {
      if (seen.has(f)) continue;
      seen.add(f);
      if (fs.existsSync(path.join(this.ctx.cwd, f))) out.push(f);
    }
    return out;
  }

  // Find the file that defines the express app, and the app variable name.
  findAppFile() {
    for (const f of this.candidateFiles()) {
      const src = fs.readFileSync(path.join(this.ctx.cwd, f), "utf8");
      const m = src.match(/(?:const|let|var)\s+(\w+)\s*=\s*express\s*\(/);
      if (m) return { file: f, appVar: m[1], src };
    }
    return null;
  }

  inject({ appImports = [], appSetup = [] }) {
    const result = {
      file: null,
      appImportsInjected: false,
      appSetupInjected: false,
    };
    const found = this.findAppFile();
    if (!found) return result; // no express app → caller falls back to guide

    result.file = found.file;
    const full = path.join(this.ctx.cwd, found.file);
    const lines = found.src.split(/\r?\n/);
    let changed = false;

    // 1. Imports — after the last import/require line.
    const newImports = appImports.filter((l) => !found.src.includes(l));
    if (appImports.length && !newImports.length) {
      result.appImportsInjected = true; // already present
    } else if (newImports.length) {
      let idx = -1;
      for (let i = 0; i < lines.length; i++) {
        if (/^\s*(import\s|(?:const|let|var)\s+.*=\s*require\()/.test(lines[i]))
          idx = i;
      }
      lines.splice(idx + 1, 0, ...newImports);
      result.appImportsInjected = true;
      changed = true;
    }

    // 2. Middleware — rename app. prefix to the real var, then place it.
    const setup = appSetup.map((l) => l.replace(/^app\./, `${found.appVar}.`));
    const newSetup = setup.filter((l) => !found.src.includes(l));
    if (appSetup.length && !newSetup.length) {
      result.appSetupInjected = true; // already present
    } else if (newSetup.length) {
      const useRe = new RegExp(`^\\s*${found.appVar}\\.(use|set)\\(`);
      const defRe = new RegExp(`${found.appVar}\\s*=\\s*express\\s*\\(`);
      let idx = -1;
      for (let i = 0; i < lines.length; i++) if (useRe.test(lines[i])) idx = i;
      if (idx < 0)
        for (let i = 0; i < lines.length; i++)
          if (defRe.test(lines[i])) {
            idx = i;
            break;
          }
      if (idx >= 0) {
        lines.splice(idx + 1, 0, ...newSetup);
        result.appSetupInjected = true;
        changed = true;
      }
    }

    if (changed) {
      fs.copyFileSync(full, full + ".bak");
      fs.writeFileSync(full, lines.join("\n"));
    }
    return result;
  }
}
