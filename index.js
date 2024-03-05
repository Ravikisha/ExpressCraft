#!/usr/bin/env node
import gradient from "gradient-string";
import figlet from "figlet";

// Phases
import end from "./Phases/end.js";
import askQuestions from "./Phases/askQuestions.js";

// Modules
import folderCreating from "./modules/FolderCreating.js";
import ProjectCreating from "./modules/ProjectCreating.js";
import Config from "./modules/Config.js";
import VersionControl from "./modules/VersionControl.js";
import TemplateEngine from "./modules/TemplateEngine.js";
import CssFramework from "./modules/CSSFramework.js";
import CSSPreprocessor from "./modules/CSSPreprocessor.js";
import DatabaseSetup from "./modules/DatabaseSetup.js";
import TestFramework from "./modules/TestFramework.js";
import Authentication from "./modules/Authentication.js";
import Linting from "./modules/Linting.js";
import Documentation from "./modules/Documentation.js";
import Readme from "./modules/Readme.js";

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
// let cssPreprocessor = "";
// let taskRunner = "";
let packageManager = "";
let versionControl = "";
let apiDocumentation = "";
// let hosting = "";
let linting = "";

// Application Start
welcome();

async function welcome() {
  console.log(gradient.vice(figlet.textSync("ExpressCraft")));
  console.log("\n✨ Welcome to Express Generator CLI tool.✨");
  console.log("\n🎯 Version: 1.4.0")
  console.log("🎗️  Author: @Ravikisha")
  console.log(
    "\nThis tool will help you to generate a new project with a template in Express js with all the necessary files, folders 📁 and dependencies 🗃️."
  );
  console.log(
    "\n🕑 Let's get started by asking some questions to setup your project 🚀\n"
  );
  const answers = await askQuestions();
  await assignAnswers(answers);
  await generateProject();
}

async function assignAnswers(answers) {
  projectName = answers.projectName;
  projectDescription = answers.projectDescription;
  projectAuthor = answers.projectAuthor;
  jsOrTs = answers.jsOrTs.toLowerCase();
  templateEngine = answers.templateEngine.toLowerCase();
  database = answers.database.toLowerCase();
  orm = answers.orm.toLowerCase();
  testing = answers.testing.toLowerCase();
  authentication = answers.authentication.toLowerCase();
  cssFramework = answers.cssFramework.toLowerCase();
  // cssPreprocessor = answers.cssPreprocessor.toLowerCase();
  // taskRunner = answers.taskRunner.toLowerCase();
  packageManager = answers.packageManager.toLowerCase();
  versionControl = answers.versionControl.toLowerCase();
  apiDocumentation = answers.apiDocumentation.toLowerCase();
  // hosting = answers.hosting.toLowerCase();
  linting = answers.linting.toLowerCase();
}

function generateProject() {
  console.log("\n\n✅ Generating Project....");

  // Folder Creating
  folderCreating(packageManager, projectName);

  // Project Creating
  let projectCreation = new ProjectCreating(packageManager, jsOrTs);
  projectCreation.creatingProject();
  
  // Setup Details
  let config = new Config(projectName, projectDescription, projectAuthor, jsOrTs, packageManager);
  config.setupDetails();
  
  // Version Control
  let vc = new VersionControl(versionControl);
  vc.createVC();

  // Template Engine
  let te = new TemplateEngine(templateEngine);
  te.createTemplateEngine();

  // CSS Framework
  let cf = new CssFramework(cssFramework);
  cf.createCssFramework();
  
  // CSS Preprocessor
  // let cp = new CSSPreprocessor(cssPreprocessor, packageManager);
  // cp.createCssPreprocessor();
  
  // Database Setup
  let db = new DatabaseSetup(
    packageManager,
    projectName,
    database,
    jsOrTs,
    orm
  );
  db.databaseSetup();
  
  // Testing Setup
  let testSetup = new TestFramework(jsOrTs, packageManager, testing);
  testSetup.testSetup();
  
  // Authentication Setup
  let auth = new Authentication(authentication, packageManager, jsOrTs);
  auth.setupAuth();
  
  // Linting Setup
  let lint = new Linting(linting, packageManager, jsOrTs);
  lint.setupLinting();
  
  // Documentation Setup
  let doc = new Documentation(apiDocumentation, packageManager, jsOrTs);
  doc.setupDocumentation();

  // Readme
  let readme = new Readme();
  readme.creatingReadme();

  // end the process
  end(projectName,packageManager);
}
