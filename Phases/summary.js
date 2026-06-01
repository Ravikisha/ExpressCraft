import chalk from "chalk";

const ROWS = [
  ["Name", "projectName"],
  ["Language", "language"],
  ["Package manager", "packageManager"],
  ["Version control", "versionControl"],
  ["Template engine", "templateEngine"],
  ["CSS framework", "cssFramework"],
  ["CSS preprocessor", "cssPreprocessor"],
  ["Database", "database"],
  ["ORM", "orm"],
  ["Testing", "testing"],
  ["Authentication", "authentication"],
  ["Linting", "linting"],
  ["API docs", "apiDocumentation"],
];

export default function summary(opts) {
  console.log(chalk.bold("\n📋 Project summary:"));
  console.log(chalk.green("-----------------------------------"));
  for (const [label, key] of ROWS) {
    const value = opts[key] || "—";
    console.log(`  ${label.padEnd(18)} ${chalk.cyan(value)}`);
  }
  console.log(chalk.green("-----------------------------------"));
}
