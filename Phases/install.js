import { execSync } from "child_process";
import ora from "ora";

/**
 * Single dependency install at the end. package.json already lists everything,
 * so one install resolves the whole tree in one pass. Supports npm/yarn/pnpm.
 */
export default function install(packageManager) {
  const cmd = `${packageManager} install`;
  const spinner = ora(
    `Installing dependencies with ${packageManager}...`
  ).start();
  try {
    execSync(cmd, { stdio: "pipe" });
    spinner.succeed("Dependencies installed.");
  } catch (err) {
    spinner.fail(`Install failed: ${err.message.split("\n")[0]}`);
    console.log(`👉 Run "${cmd}" manually inside the project folder.`);
  }
}
