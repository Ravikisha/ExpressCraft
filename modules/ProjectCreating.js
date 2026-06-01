/**
 * Registers the Express base, language tooling, base scripts and tsconfig.
 * Installs nothing — only mutates the Manifest.
 */
export default class ProjectCreating {
  constructor(manifest) {
    this.manifest = manifest;
  }

  register() {
    const m = this.manifest;

    m.addDep("express");
    m.addDevDep("nodemon");

    if (m.isTs()) {
      m.addDevDep("typescript")
        .addDevDep("@types/express")
        .addDevDep("@types/node")
        .addDevDep("ts-node");

      m.setScript("build", "tsc")
        .setScript("start", "node dist/index.js")
        .setScript("dev", "nodemon src/index.ts");

      m.addFile(
        "tsconfig.json",
        JSON.stringify(
          {
            compilerOptions: {
              target: "es2022",
              module: "commonjs",
              moduleResolution: "node",
              outDir: "./dist",
              rootDir: "./src",
              strict: true,
              esModuleInterop: true,
              forceConsistentCasingInFileNames: true,
              skipLibCheck: true,
              resolveJsonModule: true,
              emitDecoratorMetadata: true,
              experimentalDecorators: true,
            },
            include: ["src/**/*"],
            exclude: ["node_modules", "dist"],
          },
          null,
          2
        )
      );
    } else {
      m.setScript("start", "node src/index.js").setScript(
        "dev",
        "nodemon src/index.js"
      );
    }

    console.log("✅ Express base registered.");
  }
}
