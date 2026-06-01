import chalk from "chalk";

export default class TestFramework {
  constructor(manifest, testing) {
    this.manifest = manifest;
    this.testing = testing;
  }

  register() {
    switch (this.testing) {
      case "jest":
        return this.jest();
      case "mocha + chai":
        return this.mocha();
      case "jasmine":
        return this.jasmine();
      case "no testing":
      default:
        console.log(chalk.yellow("🔔 No Testing Framework selected."));
    }
  }

  jest() {
    const m = this.manifest;
    m.addDeps("jest supertest cross-env", { dev: true });
    m.setScript("test", "cross-env NODE_ENV=test jest");
    if (m.isTs()) {
      m.addDeps("ts-jest @types/jest @types/supertest", { dev: true });
      m.addFile(
        "jest.config.js",
        `module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
};
`
      );
    }
    console.log("✅ Jest registered.");
  }

  mocha() {
    const m = this.manifest;
    m.addDeps("mocha chai supertest", { dev: true });
    if (m.isTs()) {
      m.addDeps("ts-node @types/mocha @types/chai", { dev: true });
      m.setScript("test", "mocha --reporter spec --require ts-node/register");
    } else {
      m.setScript("test", "mocha --reporter spec");
    }
    console.log("✅ Mocha + Chai registered.");
  }

  jasmine() {
    const m = this.manifest;
    m.addDeps("jasmine supertest", { dev: true });
    m.setScript("test", "jasmine");
    if (m.isTs()) {
      m.addDeps("ts-node @types/jasmine", { dev: true });
    }
    m.addFile(
      "spec/support/jasmine.json",
      JSON.stringify(
        {
          spec_dir: "spec",
          spec_files: m.isTs() ? ["**/*[sS]pec.ts"] : ["**/*[sS]pec.js"],
          helpers: ["helpers/**/*.js"],
          stopSpecOnExpectationFailure: false,
          random: false,
        },
        null,
        2
      )
    );
    console.log("✅ Jasmine registered.");
  }
}
