import chalk from "chalk";

const ENGINE = {
  ejs: { dep: "ejs", engine: "ejs", ext: "ejs" },
  pug: { dep: "pug", engine: "pug", ext: "pug" },
  twig: { dep: "twig", engine: "twig", ext: "twig" },
  handlebars: { dep: "handlebars", engine: "hbs", ext: "hbs" },
};

const SAMPLE = {
  ejs: `<!DOCTYPE html>
<html>
  <head><title><%= title %></title></head>
  <body><h1><%= title %></h1></body>
</html>
`,
  pug: `doctype html
html
  head
    title= title
  body
    h1= title
`,
  twig: `<!DOCTYPE html>
<html>
  <head><title>{{ title }}</title></head>
  <body><h1>{{ title }}</h1></body>
</html>
`,
  handlebars: `<!DOCTYPE html>
<html>
  <head><title>{{title}}</title></head>
  <body><h1>{{title}}</h1></body>
</html>
`,
};

export default class TemplateEngine {
  constructor(manifest, templateEngine) {
    this.manifest = manifest;
    this.templateEngine = templateEngine;
  }

  register() {
    const cfg = ENGINE[this.templateEngine];
    if (!cfg) {
      console.log(chalk.yellow("🔔 No Template Engine selected."));
      return;
    }
    const m = this.manifest;
    m.addDep(cfg.dep);
    if (this.templateEngine === "handlebars") m.addDep("hbs"); // express view adapter

    // Wire the view engine into the generated app.
    m.addAppImport(
      m.isTs() ? `import path from "path";` : `const path = require("path");`
    );
    m.addAppSetup(`app.set("view engine", "${cfg.engine}");`);
    m.addAppSetup(`app.set("views", path.join(__dirname, "../views"));`);

    m.addFile(`views/index.${cfg.ext}`, SAMPLE[this.templateEngine]);
    m.note(`Render a view with: res.render("index", { title: "${m.name}" }).`);
    console.log(`✅ ${cfg.dep} registered and wired.`);
  }
}
