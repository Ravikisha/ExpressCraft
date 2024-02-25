import chalk from "chalk";
import chalkAnimation from 'chalk-animation';

async function end(projectName, projectDescription, projectAuthor, packageManager) {

  console.log(chalk.green("\nThank you for using Express Generator CLI tool."));
  // show project name and author and ways to run the project
  console.log(chalk.green("Your project is created with the following details:"));
  console.log(chalk.green("Project Name: " + projectName));
  console.log(chalk.green("Project Description: " + projectDescription));
  console.log(chalk.green("Project Author: " + projectAuthor));
  console.log(chalk.green("To run the project:"));
  if (packageManager === "npm") {
    console.log(chalk.green("Dev Mode: npm run dev"));
    console.log(chalk.green("Production Mode: npm start"));
  } else {
    console.log(chalk.green("Dev Mode: yarn dev"));
    console.log(chalk.green("Production Mode: yarn start"));
  }
  
  console.log(chalk.green("Happy Coding!"));
  chalkAnimation.rainbow('Goodbye!').stop();
}

export default end;
