import chalk from "chalk";

export default class Documentation {
  constructor(manifest, apiDocumentation) {
    this.manifest = manifest;
    this.apiDocumentation = apiDocumentation; // "swagger" | "postman" | "no api documentation"
  }

  register() {
    switch (this.apiDocumentation) {
      case "swagger":
        return this.swagger();
      case "postman":
        return this.postman();
      case "no api documentation":
      default:
        console.log(chalk.yellow("🔔 No API Documentation selected."));
    }
  }

  swagger() {
    const m = this.manifest;
    m.addDep("swagger-ui-express");
    if (m.isTs()) m.addDevDep("@types/swagger-ui-express");
    m.note(
      "Mount Swagger UI: app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec))."
    );
    console.log("✅ Swagger registered.");
  }

  postman() {
    // newman runs Postman collections (CI), it does not generate docs.
    this.manifest.addDevDep("newman");
    this.manifest.note(
      "Newman registered to run Postman collections. Export your collection from the Postman app."
    );
    console.log("✅ Postman (newman) registered.");
  }
}
