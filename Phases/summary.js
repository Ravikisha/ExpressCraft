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
  const extras = ["docker", "ci", "hooks", "logger"].filter((k) => opts[k]);
  console.log(
    `  ${"Extras".padEnd(18)} ${chalk.cyan(extras.length ? extras.join(", ") : "—")}`
  );
  const ai = opts.aiAssistants || [];
  console.log(
    `  ${"AI assistants".padEnd(18)} ${chalk.cyan(ai.length ? ai.join(", ") : "—")}`
  );
  if (ai.length) {
    const skills = Array.isArray(opts.aiSkills)
      ? `${opts.aiSkills.length} selected`
      : "all for stack";
    console.log(`  ${"AI skills".padEnd(18)} ${chalk.cyan(skills)}`);
  }
  console.log(chalk.green("-----------------------------------"));
}
