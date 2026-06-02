import fs from "fs";
import path from "path";
import chalk from "chalk";
import Injector from "./Injector.js";

/**
 * Add-mode (Phase 1): augment an existing project safely.
 * - Merges deps/scripts into package.json (existing versions win).
 * - Writes only files that don't already exist (skips + warns otherwise).
 * - Appends missing keys to .env.
 * - Emits manual wiring instructions to EXPRESSCRAFT_SETUP.md (never edits source).
 */
export default class AddProject {
  constructor(
    manifest,
    ctx,
    { force = false, dryRun = false, inject = false } = {}
  ) {
    this.m = manifest;
    this.ctx = ctx;
    this.force = force;
    this.dryRun = dryRun;
    this.inject = inject;
  }

  computePlan() {
    const m = this.m;
    const ctx = this.ctx;

    const depsToAdd = [];
    const depsSkipped = [];
    for (const [name, ver] of m.dependencies) {
      if (ctx.hasDep(name)) depsSkipped.push(name);
      else depsToAdd.push([name, ver]);
    }
    const devDepsToAdd = [];
    for (const [name, ver] of m.devDependencies) {
      if (ctx.hasDep(name)) depsSkipped.push(name);
      else devDepsToAdd.push([name, ver]);
    }

    const scriptsToAdd = {};
    const scriptsConflict = [];
    for (const [name, cmd] of Object.entries(m.scripts)) {
      if (!(name in ctx.scripts)) scriptsToAdd[name] = cmd;
      else if (ctx.scripts[name] !== cmd)
        scriptsConflict.push({
          name,
          existing: ctx.scripts[name],
          wanted: cmd,
        });
    }

    const filesToWrite = [];
    const filesSkipped = [];
    for (const f of m.files) {
      const exists = fs.existsSync(path.join(ctx.cwd, f.path));
      if (exists && !this.force) filesSkipped.push(f.path);
      else filesToWrite.push(f);
    }

    const envToAdd = m.env.filter((e) => !ctx.envKeys.has(e.key));

    const wiring = {
      appImports: m.appImports,
      appSetup: m.appSetup,
      serverImports: m.serverImports,
      bootstrap: m.bootstrap,
    };

    return {
      depsToAdd,
      devDepsToAdd,
      depsSkipped,
      scriptsToAdd,
      scriptsConflict,
      filesToWrite,
      filesSkipped,
      envToAdd,
      wiring,
      notes: m.postInstallNotes,
    };
  }

  hasChanges(p) {
    return (
      p.depsToAdd.length ||
      p.devDepsToAdd.length ||
      Object.keys(p.scriptsToAdd).length ||
      p.filesToWrite.length ||
      p.envToAdd.length
    );
  }

  printPlan(p) {
    const list = (label, items) => {
      if (!items.length) return;
      console.log(chalk.bold(`\n${label}`));
      items.forEach((i) => console.log(`  + ${i}`));
    };
    console.log(chalk.cyan("\n📋 Planned changes:"));
    list(
      "Dependencies",
      p.depsToAdd.map(([n, v]) => `${n}@${v}`)
    );
    list(
      "Dev dependencies",
      p.devDepsToAdd.map(([n, v]) => `${n}@${v}`)
    );
    list(
      "Scripts",
      Object.entries(p.scriptsToAdd).map(([n, c]) => `${n}: ${c}`)
    );
    list(
      "Files",
      p.filesToWrite.map((f) => f.path)
    );
    list(
      "Env keys",
      p.envToAdd.map((e) => e.key)
    );

    if (p.depsSkipped.length)
      console.log(
        chalk.gray(`\nAlready present (skipped): ${p.depsSkipped.join(", ")}`)
      );
    if (p.filesSkipped.length)
      console.log(
        chalk.yellow(
          `\n⚠️  Existing files left untouched (use --force to overwrite):`
        )
      );
    p.filesSkipped.forEach((f) => console.log(chalk.yellow(`  • ${f}`)));
    if (p.scriptsConflict.length) {
      console.log(
        chalk.yellow(
          `\n⚠️  Script conflicts (kept yours, use --force to replace):`
        )
      );
      p.scriptsConflict.forEach((c) =>
        console.log(chalk.yellow(`  • ${c.name}: have "${c.existing}"`))
      );
    }
  }

  apply(p) {
    const ctx = this.ctx;
    const pkgPath = path.join(ctx.cwd, "package.json");

    // 1. Back up + merge package.json
    fs.copyFileSync(pkgPath, pkgPath + ".bak");
    const pkg = JSON.parse(JSON.stringify(ctx.pkg));
    pkg.dependencies = pkg.dependencies || {};
    pkg.devDependencies = pkg.devDependencies || {};
    pkg.scripts = pkg.scripts || {};
    for (const [n, v] of p.depsToAdd) pkg.dependencies[n] = v;
    for (const [n, v] of p.devDepsToAdd) pkg.devDependencies[n] = v;
    Object.assign(pkg.scripts, p.scriptsToAdd);
    if (this.force)
      p.scriptsConflict.forEach((c) => (pkg.scripts[c.name] = c.wanted));
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    console.log("✅ package.json merged (backup: package.json.bak).");

    // 2. Write missing files
    for (const f of p.filesToWrite) {
      const full = path.join(ctx.cwd, f.path);
      const dir = path.dirname(full);
      if (dir && dir !== ".") fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(full, f.content);
    }
    if (p.filesToWrite.length)
      console.log(`✅ Wrote ${p.filesToWrite.length} file(s).`);

    // 3. Append missing env keys
    if (p.envToAdd.length) {
      this.appendEnv(path.join(ctx.cwd, ".env"), p.envToAdd, false);
      this.appendEnv(path.join(ctx.cwd, ".env.example"), p.envToAdd, true);
      console.log("✅ Updated .env / .env.example.");
    }

    // 4. Optionally inject safe wiring into the entry file, then write a guide
    //    for whatever could not be injected.
    const guideWiring = {
      appImports: p.wiring.appImports,
      appSetup: p.wiring.appSetup,
      serverImports: p.wiring.serverImports,
      bootstrap: p.wiring.bootstrap,
    };

    if (this.inject) {
      const res = new Injector(this.ctx).inject({
        appImports: p.wiring.appImports,
        appSetup: p.wiring.appSetup,
      });
      if (res.file) {
        if (res.appImportsInjected) guideWiring.appImports = [];
        if (res.appSetupInjected) guideWiring.appSetup = [];
        const did = [
          res.appImportsInjected && "imports",
          res.appSetupInjected && "middleware",
        ].filter(Boolean);
        if (did.length)
          console.log(
            `🔧 Injected ${did.join(" + ")} into ${res.file} (backup: ${res.file}.bak).`
          );
        else
          console.log(
            chalk.yellow("🔧 --inject: nothing to inject; see setup guide.")
          );
      } else {
        console.log(
          chalk.yellow(
            "🔧 --inject: couldn't locate an express() app — see setup guide."
          )
        );
      }
    }

    this.writeSetupGuide(guideWiring, p.notes);
  }

  appendEnv(file, entries, example) {
    const lines = entries.map((e) => {
      const kv = `${e.key}=${example ? "" : e.value}`;
      return e.comment ? `# ${e.comment}\n${kv}` : kv;
    });
    const prefix = fs.existsSync(file) ? "\n# Added by ExpressCraft\n" : "";
    fs.appendFileSync(file, prefix + lines.join("\n") + "\n");
  }

  writeSetupGuide(w, notes) {
    const hasWiring =
      w.appImports.length ||
      w.appSetup.length ||
      w.serverImports.length ||
      w.bootstrap.length ||
      notes.length;
    if (!hasWiring) return;

    const code = (arr) => "```js\n" + arr.join("\n") + "\n```";
    const sections = [`# ExpressCraft — Manual Wiring\n`];
    sections.push(
      `Apply these by hand. Tip: re-run \`expresscraft add ... --inject\` to let ExpressCraft insert the imports and middleware into your entry file automatically (bootstrap lines still need manual placement inside an async function).\n`
    );
    if (w.appImports.length)
      sections.push(`## Imports for your app file\n${code(w.appImports)}`);
    if (w.appSetup.length)
      sections.push(
        `## Middleware / setup (add after your existing app.use calls)\n${code(w.appSetup)}`
      );
    if (w.serverImports.length)
      sections.push(
        `## Imports for your server entry\n${code(w.serverImports)}`
      );
    if (w.bootstrap.length)
      sections.push(
        `## Bootstrap (run before app.listen, inside an async function)\n${code(w.bootstrap)}`
      );
    if (notes.length)
      sections.push(`## Notes\n${notes.map((n) => `- ${n}`).join("\n")}`);

    const out = path.join(this.ctx.cwd, "EXPRESSCRAFT_SETUP.md");
    fs.writeFileSync(out, sections.join("\n\n") + "\n");
    console.log(
      chalk.cyan("📝 Wiring instructions written to EXPRESSCRAFT_SETUP.md")
    );
  }
}
