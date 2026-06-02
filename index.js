#!/usr/bin/env node
import gradient from "gradient-string";
import figlet from "figlet";
import inquirer from "inquirer";
import chalk from "chalk";
import updateNotifier from "update-notifier";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Phases
import {
  askProjectMeta,
  askFeatures,
  validProjectName,
} from "./Phases/askQuestions.js";
import { askAddFeatures, featuresFromFlags } from "./Phases/addQuestions.js";
import summary from "./Phases/summary.js";
import install from "./Phases/install.js";
import end from "./Phases/end.js";

// Modules
import Manifest from "./modules/Manifest.js";
import { parseArgs, HELP } from "./modules/args.js";
import { getPreset, PRESET_NAMES } from "./modules/presets.js";
import ProjectContext from "./modules/ProjectContext.js";
import AddProject from "./modules/AddProject.js";
import folderCreating from "./modules/FolderCreating.js";
import ProjectCreating from "./modules/ProjectCreating.js";
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
import Scaffold from "./modules/Scaffold.js";
import Logger from "./modules/Logger.js";
import Docker from "./modules/Docker.js";
import CI from "./modules/CI.js";
import GitHooks from "./modules/GitHooks.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function toolPkg() {
  try {
    return JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "package.json"), "utf8")
    );
  } catch {
    return { version: "unknown" };
  }
}

function checkForUpdate() {
  try {
    updateNotifier({ pkg: toolPkg() }).notify({ isGlobal: true });
  } catch {
    /* offline / no cache dir — ignore */
  }
}

// Raw inquirer feature answers -> canonical contract used by modules.
function normalizeFeatures(a) {
  const auth = {
    "Passport.js": "passport",
    JWT: "jwt",
    "No Authentication": "no authentication",
  };
  const ex = new Set(a.extras || []);
  return {
    packageManager: a.packageManager.toLowerCase(),
    language: a.jsOrTs.toLowerCase(),
    versionControl: a.versionControl.toLowerCase(),
    templateEngine: a.templateEngine.toLowerCase(),
    cssFramework: a.cssFramework.toLowerCase(),
    cssPreprocessor: a.cssPreprocessor.toLowerCase(),
    database: a.database.toLowerCase(),
    orm: (a.orm || "No ORM").toLowerCase(),
    testing: a.testing.toLowerCase(),
    authentication: auth[a.authentication] ?? "no authentication",
    linting: a.linting.toLowerCase(),
    apiDocumentation: a.apiDocumentation.toLowerCase(),
    docker: ex.has("docker"),
    ci: ex.has("ci"),
    hooks: ex.has("hooks"),
    logger: ex.has("logger"),
  };
}

function applyFlagOverrides(features, args) {
  if (args.pm) features.packageManager = args.pm.toLowerCase();
  if (args.language) features.language = args.language;
  for (const k of ["docker", "ci", "hooks", "logger"])
    if (args[k]) features[k] = true;
  return features;
}

function writeFiles(manifest) {
  for (const { path: filePath, content } of manifest.files) {
    const dir = path.dirname(filePath);
    if (dir && dir !== ".") fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, content);
  }
}

function writePackageJson(manifest) {
  fs.writeFileSync(
    "package.json",
    JSON.stringify(manifest.toPackageJson(), null, 2)
  );
  console.log("✅ package.json created from your choices.");
}

async function collectOptions(args) {
  // Non-interactive: preset/flags only.
  if (args.yes || args.preset) {
    const name = args.name;
    const nameCheck = validProjectName(name);
    if (nameCheck !== true) {
      console.log(`❌ ${nameCheck} Pass --name <name>.`);
      process.exit(1);
    }
    const presetName = args.preset || "minimal";
    const preset = getPreset(presetName);
    if (!preset) {
      console.log(
        `❌ Unknown preset "${presetName}". Available: ${PRESET_NAMES.join(", ")}.`
      );
      process.exit(1);
    }
    return {
      projectName: name.trim(),
      projectDescription: "",
      projectAuthor: "",
      ...applyFlagOverrides(preset, args),
      _interactive: false,
    };
  }

  // Interactive.
  const meta = await askProjectMeta();
  const features =
    meta.preset === "custom"
      ? normalizeFeatures(await askFeatures())
      : getPreset(meta.preset);
  return {
    projectName: (args.name || meta.projectName).trim(),
    projectDescription: meta.projectDescription || "",
    projectAuthor: meta.projectAuthor || "",
    ...applyFlagOverrides(features, args),
    _interactive: true,
  };
}

async function resolveOverwrite(opts, args) {
  if (!fs.existsSync(opts.projectName)) return false;
  if (args.force) return true;
  if (!opts._interactive) {
    console.log(
      `❌ Folder "${opts.projectName}" already exists. Use --force to overwrite.`
    );
    process.exit(1);
  }
  const { action } = await inquirer.prompt([
    {
      name: "action",
      type: "list",
      message: `Folder "${opts.projectName}" exists. What now?`,
      choices: [
        { name: "Overwrite it", value: "overwrite" },
        { name: "Cancel", value: "cancel" },
      ],
    },
  ]);
  if (action === "cancel") {
    console.log("🛑 Aborted.");
    process.exit(0);
  }
  return true;
}

async function welcome() {
  const args = parseArgs();
  if (args.help) {
    console.log(HELP);
    return;
  }

  checkForUpdate();
  console.log(gradient.vice(figlet.textSync("ExpressCraft")));
  console.log(
    `\n✨ ExpressCraft v${toolPkg().version} — Express.js generator ✨\n`
  );

  if (args.command === "add") {
    await runAdd(args);
    return;
  }
  await runCreate(args);
}

async function runAdd(args) {
  let ctx;
  try {
    ctx = ProjectContext.detect();
  } catch (e) {
    console.log(`❌ ${e.message}`);
    process.exit(1);
  }

  const language = args.language || ctx.language;
  const packageManager = args.pm ? args.pm.toLowerCase() : ctx.packageManager;
  console.log(
    `🔎 Detected: ${language}, ${packageManager}${ctx.entryFile ? `, entry ${ctx.entryFile}` : ""}`
  );

  if (ctx.gitDirty && !args.yes && !args.force && !args.dryRun) {
    const { go } = await inquirer.prompt([
      {
        name: "go",
        type: "confirm",
        message: "Git working tree is dirty. Continue anyway?",
        default: false,
      },
    ]);
    if (!go) {
      console.log("🛑 Aborted.");
      return;
    }
  }

  const extrasFlagged = args.docker || args.ci || args.hooks || args.logger;
  const hasFlags = Object.keys(args.categories).length > 0 || extrasFlagged;
  let features;
  if (hasFlags) features = featuresFromFlags(args.categories);
  else if (args.yes) {
    console.log(
      "❌ Non-interactive add needs flags, e.g. --db postgresql --auth jwt --docker."
    );
    process.exit(1);
  } else features = await askAddFeatures();

  // Extras flags override (work in both interactive and flag mode).
  for (const k of ["docker", "ci", "hooks", "logger"])
    if (args[k]) features[k] = true;

  const manifest = new Manifest({
    name: ctx.name,
    language,
    packageManager,
    mode: "add",
  });

  new TemplateEngine(manifest, features.templateEngine).register();
  new CssFramework(manifest, features.cssFramework).register();
  new CSSPreprocessor(manifest, features.cssPreprocessor).register();
  new DatabaseSetup(manifest, features.database, features.orm).register();
  new TestFramework(manifest, features.testing).register();
  new Authentication(manifest, features.authentication).register();
  new Linting(manifest, features.linting).register();
  new Documentation(manifest, features.apiDocumentation).register();
  new Logger(manifest, { enabled: features.logger }).register();
  new Docker(manifest, {
    enabled: features.docker,
    database: features.database,
  }).register();
  new CI(manifest, { enabled: features.ci }).register();
  new GitHooks(manifest, { enabled: features.hooks }).register();

  const adder = new AddProject(manifest, ctx, {
    force: args.force,
    dryRun: args.dryRun,
    inject: args.inject,
  });
  const plan = adder.computePlan();

  if (!adder.hasChanges(plan)) {
    console.log("\n✅ Nothing to add — selected features are already present.");
    return;
  }

  adder.printPlan(plan);

  if (args.dryRun) {
    console.log(chalk.gray("\n(dry run — nothing was written)"));
    return;
  }

  if (!args.yes) {
    const { confirmed } = await inquirer.prompt([
      {
        name: "confirmed",
        type: "confirm",
        message: "Apply these changes?",
        default: true,
      },
    ]);
    if (!confirmed) {
      console.log("🛑 Aborted. No changes made.");
      return;
    }
  }

  console.log("");
  adder.apply(plan);
  install(packageManager);

  console.log("\n🎉 Done. Review EXPRESSCRAFT_SETUP.md for any manual wiring.");
}

async function runCreate(args) {
  const opts = await collectOptions(args);
  summary(opts);

  const overwrite = await resolveOverwrite(opts, args);

  if (opts._interactive) {
    const { confirmed } = await inquirer.prompt([
      {
        name: "confirmed",
        type: "confirm",
        message: "Create the project with these settings?",
        default: true,
      },
    ]);
    if (!confirmed) {
      console.log("🛑 Aborted. No changes made.");
      return;
    }
  }

  await generateProject(opts, { overwrite });
}

async function generateProject(opts, { overwrite }) {
  console.log("\n✅ Generating project...\n");

  const manifest = new Manifest({
    name: opts.projectName,
    description: opts.projectDescription,
    author: opts.projectAuthor,
    language: opts.language,
    packageManager: opts.packageManager,
  });

  const parentDir = process.cwd();
  try {
    folderCreating(opts.projectName, { overwrite });

    // Register feature deps + code fragments onto the manifest.
    new ProjectCreating(manifest).register();
    new TemplateEngine(manifest, opts.templateEngine).register();
    new CssFramework(manifest, opts.cssFramework).register();
    new CSSPreprocessor(manifest, opts.cssPreprocessor).register();
    new DatabaseSetup(manifest, opts.database, opts.orm).register();
    new TestFramework(manifest, opts.testing).register();
    new Authentication(manifest, opts.authentication).register();
    new Linting(manifest, opts.linting).register();
    new Documentation(manifest, opts.apiDocumentation).register();
    new Logger(manifest, { enabled: opts.logger }).register();

    // Scaffold renders app/server/routes from the collected fragments — last.
    new Scaffold(manifest).register();
    new Readme(manifest).creatingReadme();

    // Extras that depend on populated scripts/structure run after the scaffold.
    new Docker(manifest, {
      enabled: opts.docker,
      database: opts.database,
    }).register();
    new CI(manifest, { enabled: opts.ci }).register();
    new GitHooks(manifest, { enabled: opts.hooks }).register();

    // Write everything, then version control, then one install.
    writeFiles(manifest);
    writePackageJson(manifest);
    new VersionControl(opts.versionControl).createVC();
    install(opts.packageManager);

    end(manifest);
  } catch (err) {
    console.log(`\n❌ Generation failed: ${err.message}`);
    // Roll back the partially-created project folder.
    try {
      process.chdir(parentDir);
      fs.rmSync(opts.projectName, { recursive: true, force: true });
      console.log("↩️  Rolled back partially-created project.");
    } catch {
      /* nothing to roll back */
    }
    process.exit(1);
  }
}

welcome();
