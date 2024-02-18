import inquirer from "inquirer";

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
      choices: ["No Template Engine", "EJS", "Pug", "Twig", "handlebars"],
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
        "No CSS Framework",
        "Tailwind CSS",
        "Bootstrap",
        "Bulma",
        "Foundation",
        "Materialize",
        "Semantic UI",
        
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
      choices: ["No CSS Preprocessor", "Sass", "Less", "PostCSS", "Stylus"],
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
        "MongoDB",
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
        "Prisma",
        "Sequelize",
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
      choices: ["No Testing", "Jest", "Mocha", "Chai", "Jasmine"],
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
      choices: ["No Authentication", "Passport.js", "JWT"],
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
      choices: ["No Task Runner", "Gulp", "Grunt"],
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
      choices: ["No API Documentation", "Swagger", "Postman"],
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
      choices: ["No Hosting", "Heroku", "Digital Ocean", "AWS", "Google Cloud"],
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

export default askQuestions;
