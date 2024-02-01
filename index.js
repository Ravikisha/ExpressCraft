#!/usr/bin/env node
import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import figlet from "figlet";
import chalkAnimation from "chalk-animation";
import execSync from "child_process";
import fs from "fs";

// Phases
import end from "./Phases/end.js";
import askQuestions from "./Phases/askQuestions.js";

// Modules
import folderCreating from "./modules/FolderCreating.js";
import ProjectCreating from "./modules/ProjectCreating.js";
import VersionControl from "./modules/VersionControl.js";
import TemplateEngine from "./modules/TemplateEngine.js";
import CssFramework from "./modules/CSSFramework.js";
import CSSPreprocessor from "./modules/CSSPreprocessor.js";

/**
 * Trying to make a CLI tool for myself to generate a new project with a template in express js with all the necessary files, folders and dependencies.
 */

// variables
let projectName = "";
let projectDescription = "";
let projectAuthor = "";
let jsOrTs = "";
let templateEngine = "";
let database = "";
let orm = "";
let testing = "";
let authentication = "";
let cssFramework = "";
let cssPreprocessor = "";
let taskRunner = "";
let packageManager = "";
let versionControl = "";
let apiDocumentation = "";
let hosting = "";

// Application Start
welcome();

async function welcome() {
  console.log(gradient.vice(figlet.textSync("Express Generator")));
  console.log(chalk.greenBright("Welcome to Express Generator CLI tool."));
  console.log(
    chalk.green(
      "This tool will help you to generate a new project with a template in express js with all the necessary files, folders and dependencies."
    )
  );
  console.log(
    chalk.green(
      "Please answer the following questions to generate your project."
    )
  );
  const answers = await askQuestions();
  await assignAnswers(answers);
  await generateProject();
  end();
}

async function assignAnswers(answers) {
  projectName = answers.projectName.toLowerCase();
  projectDescription = answers.projectDescription.toLowerCase();
  projectAuthor = answers.projectAuthor.toLowerCase();
  jsOrTs = answers.jsOrTs.toLowerCase();
  templateEngine = answers.templateEngine.toLowerCase();
  database = answers.database.toLowerCase();
  orm = answers.orm.toLowerCase();
  testing = answers.testing.toLowerCase();
  authentication = answers.authentication.toLowerCase();
  cssFramework = answers.cssFramework.toLowerCase();
  cssPreprocessor = answers.cssPreprocessor.toLowerCase();
  taskRunner = answers.taskRunner.toLowerCase();
  packageManager = answers.packageManager.toLowerCase();
  versionControl = answers.versionControl.toLowerCase();
  apiDocumentation = answers.apiDocumentation.toLowerCase();
  hosting = answers.hosting.toLowerCase();
}

async function generateProject() {
  console.log(chalk.green("Generating project..."));
  // Folder Creating
  await folderCreating(packageManager, projectName);
  // Project Creating
  let projectCreation = new ProjectCreating(packageManager, jsOrTs);
  await projectCreation.creatingProject();
  // Version Control
  let vc = new VersionControl(versionControl);
  await vc.createVC();
  // Template Engine
  let te = new TemplateEngine(templateEngine);
  await te.createTemplateEngine();
  // CSS Framework
  let cf = new CssFramework(cssFramework);
  await cf.createCssFramework();
  // CSS Preprocessor
  // let cp = new CSSPreprocessor(cssPreprocessor, packageManager);
  // await cp.createCssPreprocessor();
}
