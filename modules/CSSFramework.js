import chalk from "chalk";

export default class CssFramework {
  constructor(manifest, cssFramework) {
    this.manifest = manifest;
    this.cssFramework = cssFramework;
  }

  register() {
    switch (this.cssFramework) {
      case "tailwind css":
        return this.tailwind();
      case "bootstrap":
        return this.simple("bootstrap jquery popper.js", "bootstrap");
      case "bulma":
        return this.simple("bulma", "bulma");
      case "foundation":
        return this.simple("foundation-sites", "foundation");
      case "materialize":
        return this.simple("materialize-css", "materialize");
      case "semantic ui":
        return this.simple("fomantic-ui", "semantic ui");
      case "no css framework":
      default:
        console.log(chalk.yellow("🔔 No CSS Framework selected."));
    }
  }

  // Frameworks that just need the dependency + a static-serve hint.
  simple(deps, label) {
    this.manifest.addDeps(deps);
    this.manifest.note(
      `Serve ${label} from node_modules via express.static, or link it in your HTML.`
    );
    console.log(`✅ ${label} registered.`);
  }

  tailwind() {
    const m = this.manifest;
    // Tailwind v4: CSS-first config, standalone CLI, no init/config file needed.
    m.addDevDep("tailwindcss").addDevDep("@tailwindcss/cli");

    m.addFile("styles/global.css", `@import "tailwindcss";\n`);

    m.appendScript(
      "build",
      "npx @tailwindcss/cli -i styles/global.css -o styles/output.css"
    );
    m.note(`Generate the Tailwind stylesheet with: ${m.runCommand("build")}`);
    console.log("✅ Tailwind CSS (v4) registered.");
  }
}
