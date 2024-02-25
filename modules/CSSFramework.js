import fs from "fs";
import { execSync } from "child_process";
import chalk from "chalk";
import { highlight } from "cli-highlight";

export default class CssFramework {
  constructor(cssFramework, packageManager) {
    this.cssFramework = cssFramework;
    this.packageManager = packageManager;
    // create a styles folder
    fs.mkdirSync("styles");
  }

  // CSS Framework
  createCssFramework() {
    if (this.cssFramework === "tailwind css") {
      this.tailwindCss();
      console.log("✅ Tailwind CSS initialized successfully.");
    } else if (this.cssFramework === "bootstrap") {
      this.bootstrap();
      console.log("✅ Bootstrap initialized successfully.");
    } else if (this.cssFramework === "bulma") {
      this.bulma();
      console.log("✅ Bulma initialized successfully.");
    } else if (this.cssFramework === "foundation") {
      this.foundation();
      console.log("✅ Foundation initialized successfully.");
    } else if (this.cssFramework === "materialize") {
      this.materialize();
      console.log("✅ Materialize initialized successfully.");
    } else if (this.cssFramework === "semantic ui") {
      this.semanticUi();
      console.log("✅ Semantic UI initialized successfully.");
    } else if (this.cssFramework === "no css framework") {
      this.noCssFramework();
    } else {
      console.log("❌ Please select a CSS Framework.");
      return;
    }
  }

  // Tailwind CSS
  tailwindCss() {
    try {
      if (this.packageManager === "npm") {
        execSync("npm install -D tailwindcss");
      } else if (this.packageManager === "yarn") {
        execSync("yarn add -D tailwindcss");
      }
      // initialize tailwind css
      execSync("npx tailwindcss init");
      // update the tailwind.config.js file
      fs.writeFileSync(
        "tailwind.config.js",
        `
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}`,
        { flag: "w" }
      );
      // create a global css file
      
      fs.writeFileSync(
        "styles/global.css",`
@tailwind base;
@tailwind components;
@tailwind utilities;`,
      );

      // update the package.json file and add the build script
      const packageJson = JSON.parse(fs.readFileSync("package.json"));
      packageJson.scripts.build =
        "npx tailwindcss build styles/global.css -o styles/output.css";
      fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));
      // Generate Command
      if (
        this.packageManager === "npm" &&
        this.cssFramework === "tailwind css"
      ) {
        console.log(
          chalk.yellow(
            "🔔 Please run the following command to generate the tailwind css file."
          )
        );
        console.log(chalk.green(`
        -------------------
        npm run build
        -------------------
        `));
      } else if (
        this.packageManager === "yarn" &&
        this.cssFramework === "tailwind css"
      ) {
        console.log(
          chalk.yellow(
            "🔔 Please run the following command to generate the tailwind css file."
          )
        );
        console.log(chalk.green(`
        -------------------
        yarn build
        -------------------
        `));
      }
    } catch (err) {
      console.log("❌ Something went wrong to install tailwind css.");
      return;
    }
  }

  // Bootstrap
  bootstrap() {
    try {
      if (this.packageManager === "npm") {
        execSync("npm install bootstrap jquery popper.js");
      } else if (this.packageManager === "yarn") {
        execSync("yarn add bootstrap jquery popper.js");
      }

      const codeSegment = `
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
)
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
)
app.use("/js", express.static(path.join(__dirname, "node_modules/jquery/dist")))      
      `;
      const code = highlight(codeSegment, {
        language: "javascript",
        ignoreIllegals: true,
      });
      console.log(
        chalk.yellow("🔔 Please add the following code to your app.js file.")
      );
      console.log(chalk.green("-------------------"));
      console.log(code);
      console.log(chalk.green("-------------------"));
    } catch (err) {
      console.log("❌ Something went wrong to install bootstrap.");
      return;
    }
  }

  // Bulma
  bulma() {
    try {
      if (this.packageManager === "npm") {
        execSync("npm install bulma");
      } else if (this.packageManager === "yarn") {
        execSync("yarn add bulma");
      }

      const codeSegment = `
<link rel="stylesheet" href="/node_modules/bulma/css/bulma.min.css">
      `;

      const code = highlight(codeSegment, {
        language: "html",
        ignoreIllegals: true,
      });
      console.log(
        chalk.yellow("🔔 Please add the following code to your index.html file.")
      );
      console.log(chalk.green("-------------------"));
      console.log(code);
      console.log(chalk.green("-------------------"));
    } catch (err) {
      console.log("❌ Something went wrong to install bulma.");
      return;
    }
  }

  // Foundation
  foundation() {
    try {
      if (this.packageManager === "npm") {
        execSync("npm install foundation-sites");
      } else if (this.packageManager === "yarn") {
        execSync("yarn add foundation-sites");
      }

      const codeSegment = `
<link rel="stylesheet" href="/node_modules/foundation-sites/dist/css/foundation.min.css">
      `;

      const code = highlight(codeSegment, {
        language: "html",
        ignoreIllegals: true,
      });

      console.log(
        chalk.yellow("🔔 Please add the following code to your index.html file.")
      );
      console.log(chalk.green("-------------------"));
      console.log(code);
      console.log(chalk.green("-------------------"));
    } catch (err) {
      console.log("❌ Something went wrong to install foundation.");
      return;
    }
  }

  // Materialize
  materialize() {
    try {
      if (this.packageManager === "npm") {
        execSync("npm install materialize-css");
      } else if (this.packageManager === "yarn") {
        execSync("yarn add materialize-css");
      }

      const codeSegment = `
<link rel="stylesheet" href="/node_modules/materialize-css/dist/css/materialize.min.css">
      `;

      const code = highlight(codeSegment, {
        language: "html",
        ignoreIllegals: true,
      });

      console.log(
        chalk.yellow("🔔 Please add the following code to your index.html file.")
      );
      console.log(chalk.green("-------------------"));
      console.log(code);
      console.log(chalk.green("-------------------"));

      const scriptSegment = `
<script src="/node_modules/materialize-css/dist/js/materialize.min.js"></script>
      `;

      const script = highlight(scriptSegment, {
        language: "html",
        ignoreIllegals: true,
      });

      console.log(
        chalk.yellow(
          "🔔 Please add the following code to your index.html file before the closing body tag."
        )
      );
      console.log(chalk.green("-------------------"));
      console.log(script);
      console.log(chalk.green("-------------------"));
    } catch (err) {
      console.log("❌ Something went wrong to install materialize.");
      return;
    }
  }

  // Semantic UI
  semanticUi() {
    try {
      if (this.packageManager === "npm") {
        execSync("nnpm install semantic-ui");
      } else if (this.packageManager === "yarn") {
        execSync("yarn add semantic-ui");
      }

      const codeSegment = `
<link rel="stylesheet" href="/node_modules/semantic-ui/dist/semantic.min.css">
      `;

      const code = highlight(codeSegment, {
        language: "html",
        ignoreIllegals: true,
      });

      console.log(
        chalk.yellow("🔔 Please add the following code to your index.html file.")
      );
      console.log(chalk.green("-------------------"));
      console.log(code);
      console.log(chalk.green("-------------------"));

      const scriptSegment = `
<script src="/node_modules/semantic-ui/dist/semantic.min.js"></script>
      `;

      const script = highlight(scriptSegment, {
        language: "html",
        ignoreIllegals: true,
      });

      console.log(
        chalk.yellow(
          "🔔 Please add the following code to your index.html file before the closing body tag."
        )
      );
      console.log(chalk.green("-------------------"));
      console.log(script);
      console.log(chalk.green("-------------------"));
    } catch (err) {
      console.log("❌ Something went wrong to install semantic ui.");
      return;
    }
  }

  // No CSS Framework
  noCssFramework() {
    console.log(chalk.yellow("🔔 No CSS Framework initialized successfully."));
  }
}
