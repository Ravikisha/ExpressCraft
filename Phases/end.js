import chalk from "chalk";

async function end(
  projectName,
  packageManager
) {
  console.log("\n💗 Thanks for using ExpressCraft .....");
  // show project name and author and ways to run the project
  console.log("\n🚀 Your project is ready!");
  console.log("\n👉 Get started with the following commands:");
  if (packageManager === "npm") {
    console.log("\n👍 Run Your Project: ");
    console.log("\n1️⃣  Open your terminal");
    console.log("\n2️⃣  Go to your project directory");
    console.log(chalk.green("-----------------------------------"));
    console.log(chalk.bold("cd " + projectName));
    console.log(chalk.green("-----------------------------------"));
    console.log("\n3️⃣  Run the following command");
    console.log(chalk.yellow("\n------------ 💻 Dev Mode --------------"));
    console.log(chalk.bold("npm run dev"));
    console.log(chalk.yellow("------------ 📈 Production Mode --------------"));
    console.log(chalk.bold("npm start"));
    console.log(chalk.yellow("-----------------------------------"));
  } else {
    console.log("\n👍 Run Your Project: ");
    console.log("\n1️⃣  Open your terminal");
    console.log("\n2️⃣  Go to your project directory");
    console.log(chalk.green("-----------------------------------"));
    console.log(chalk.bold("cd " + projectName));
    console.log(chalk.green("-----------------------------------"));
    console.log("\n3️⃣  Run the following command");
    console.log(chalk.yellow("\n------------ 💻 Dev Mode --------------"));
    console.log(chalk.bold("yarn dev"));
    console.log(chalk.yellow("------------ 📈 Production Mode --------------"));
    console.log(chalk.bold("yarn start"));
    console.log(chalk.yellow("-----------------------------------"));
  }

  console.log("\n😎 Happy Coding! 🎉");
  console.log(
    chalk.greenBright(
      "\n🌟 If you like ExpressCraft, give us a star on GitHub"
    )
  );
}

export default end;
