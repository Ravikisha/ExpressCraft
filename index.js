#!/usr/bin/env node
import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import figlet from "figlet";
import chalkAnimation from "chalk-animation";
import execSync from "child_process";
import fs from "fs";
import folderCreating from "./modules/FolderCreating.js";

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

async function end() {
  console.log(chalk.green("Thank you for using Express Generator CLI tool."));
}

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

async function askQuestions() {
  const questions = [
    {
      name: "projectName",
      type: "input",
      message: "What is your project name?",
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return "Please enter your project name.";
        }
      },
    },
    {
      name: "projectDescription",
      type: "input",
      message: "What is your project description?",
    },
    {
      name: "projectAuthor",
      type: "input",
      message: "What is your project author?",
    },
    {
      name: "packageManager",
      type: "list",
      message: "What is your project Package Manager?",
      choices: ["NPM", "Yarn"],
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return "Please select your project Package Manager.";
        }
      },
    },
    {
      name: "jsOrTs",
      type: "list",
      message: "What is your project language?",
      choices: ["JavaScript", "TypeScript"],
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return "Please select your project language.";
        }
      },
    },
    {
      name: "versionControl",
      type: "list",
      message: "What is your project Version Control?",
      choices: ["Git", "SVN", "No Version Control"],
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return "Please select your project Version Control.";
        }
      },
    },
    {
      name: "templateEngine",
      type: "list",
      message: "What is your project template engine?",
      choices: [
        "EJS",
        "Pug",
        "Handlebars",
        "Mustache",
        "Nunjucks",
        "Twig",
        "No Template Engine",
      ],
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return "Please select your project template engine.";
        }
      },
    },
    {
      name: "cssFramework",
      type: "list",
      message: "What is your project CSS Framework?",
      choices: [
        "Tailwind CSS",
        "Bootstrap",
        "Bulma",
        "Foundation",
        "Materialize",
        "Pure CSS",
        "No CSS Framework",
      ],
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return "Please select your project CSS Framework.";
        }
      },
    },
    {
      name: "cssPreprocessor",
      type: "list",
      message: "What is your project CSS Preprocessor?",
      choices: ["Sass", "Less", "Stylus", "No CSS Preprocessor"],
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return "Please select your project CSS Preprocessor.";
        }
      },
    },
    {
      name: "database",
      type: "list",
      message: "What is your project database?",
      choices: [
        "MySQL",
        "PostgreSQL",
        "SQLite",
        "MariaDB",
        "Microsoft SQL Server",
        "Oracle Database",
        "MongoDB",
        "Cassandra",
        "Redis",
        "Firebase",
        "No Database",
      ],
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return "Please select your project database.";
        }
      },
    },
    {
      name: "orm",
      type: "list",
      message: "What is your project ORM?",
      choices: [
        "Sequelize",
        "Prisma",
        "TypeORM",
        "Mongoose",
        "Drizzle ORM",
        "No ORM",
      ],
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return "Please select your project ORM.";
        }
      },
    },
    {
      name: "testing",
      type: "list",
      message: "What is your project testing?",
      choices: ["Jest", "Mocha", "Chai", "Jasmine", "No Testing"],
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return "Please select your project testing.";
        }
      },
    },
    {
      name: "authentication",
      type: "list",
      message: "What is your project authentication?",
      choices: ["Passport.js", "JWT", "No Authentication"],
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return "Please select your project authentication.";
        }
      },
    },

    {
      name: "taskRunner",
      type: "list",
      message: "What is your project Task Runner?",
      choices: ["Gulp", "Grunt", "No Task Runner"],
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return "Please select your project Task Runner.";
        }
      },
    },

    {
      name: "apiDocumentation",
      type: "list",
      message: "What is your project API Documentation?",
      choices: ["Swagger", "Postman", "No API Documentation"],
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return "Please select your project API Documentation.";
        }
      },
    },
    {
      name: "hosting",
      type: "list",
      message: "What is your project Hosting?",
      choices: ["Heroku", "Digital Ocean", "AWS", "Google Cloud", "No Hosting"],
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return "Please select your project Hosting.";
        }
      },
    },
  ];
  return inquirer.prompt(questions);
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
  await folderCreating(packageManager, projectName);
}
