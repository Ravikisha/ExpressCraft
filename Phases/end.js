import chalk from "chalk";

function end(manifest) {
  const notes = manifest.postInstallNotes;
  const dev = manifest.runCommand("dev");
  const start = manifest.runCommand("start");

  console.log("\n💗 Thanks for using ExpressCraft!");
  console.log("\n🚀 Your project is ready!");

  if (notes.length) {
    console.log(chalk.cyan("\n📝 Next steps / notes:"));
    notes.forEach((n) => console.log(chalk.cyan(`  • ${n}`)));
  }

  console.log("\n👉 Get started:");
  console.log(chalk.green("-----------------------------------"));
  console.log(chalk.bold(`cd ${manifest.name}`));
  console.log(chalk.yellow("\n💻 Dev Mode:"));
  console.log(chalk.bold(dev));
  console.log(chalk.yellow("\n📈 Production Mode:"));
  console.log(chalk.bold(start));
  console.log(chalk.green("-----------------------------------"));

  console.log("\n😎 Happy Coding! 🎉");
  console.log(
    chalk.greenBright("\n🌟 If you like ExpressCraft, give us a star on GitHub")
  );
}

export default end;
