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

export default assignAnswers;
