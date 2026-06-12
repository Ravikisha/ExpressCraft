import { execSync } from "child_process";
import chalk from "chalk";
import { sourceFor } from "./skillsCatalog.js";

/**
 * SkillFetcher — downloads the OFFICIAL skills that match the user's tools via
 * the `skills` CLI (`npx skills add <repo> --skill <name>`), from
 * officialskills.sh. Only runs when the user opts in with --fetch-skills.
 *
 * Skills without an official source are left as the ExpressCraft-authored
 * starters already written to disk; nothing to download for those.
 *
 * Runs in the current working directory (the generated/target project).
 */
export default class SkillFetcher {
  // skillIds: string[] of catalog ids the project is using.
  fetchAll(skillIds = []) {
    const seen = new Set();
    const jobs = [];
    for (const id of skillIds) {
      const src = sourceFor(id);
      if (!src.official) continue;
      const key = `${src.repo}#${src.skill}`;
      if (seen.has(key)) continue;
      seen.add(key);
      jobs.push(src);
    }

    if (!jobs.length) {
      console.log(
        chalk.yellow(
          "ℹ️  --fetch-skills: none of your tools map to an official skill yet. See AI_SKILLS.md."
        )
      );
      return;
    }

    console.log(
      chalk.bold(`\n⬇️  Fetching ${jobs.length} official skill(s) via npx skills...`)
    );
    for (const src of jobs) {
      const cmd = `npx --yes skills add ${src.repo} --skill ${src.skill}`;
      console.log(chalk.cyan(`   ${cmd}`));
      try {
        execSync(cmd, { stdio: "inherit" });
      } catch (e) {
        console.log(
          chalk.yellow(
            `   ⚠️  Failed (${e.status ?? e.message}). Run it manually later — see AI_SKILLS.md.`
          )
        );
      }
    }
  }
}
