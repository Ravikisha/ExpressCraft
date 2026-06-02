import chalk from "chalk";

/**
 * Husky + lint-staged pre-commit hook. `prepare: husky` installs the hooks on
 * the next install. lint-staged config lives in its own file (no package.json
 * schema changes needed).
 */
export default class GitHooks {
  constructor(manifest, { enabled }) {
    this.m = manifest;
    this.enabled = enabled;
  }

  register() {
    if (!this.enabled) return;
    const m = this.m;
    m.addDeps("husky lint-staged prettier", { dev: true });
    m.setScript("prepare", "husky");

    m.addFile(
      ".lintstagedrc.json",
      JSON.stringify({ "*.{js,ts,json,md}": "prettier --write" }, null, 2)
    );
    m.addFile(".husky/pre-commit", "npx lint-staged\n");
    m.note(
      "Git hooks install automatically on your next install (via the prepare script)."
    );
    console.log(chalk.green("✅ Husky + lint-staged registered."));
  }
}
