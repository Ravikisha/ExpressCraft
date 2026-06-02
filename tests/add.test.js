import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";
import Manifest from "../modules/Manifest.js";
import ProjectContext from "../modules/ProjectContext.js";
import AddProject from "../modules/AddProject.js";
import DatabaseSetup from "../modules/DatabaseSetup.js";
import TestFramework from "../modules/TestFramework.js";
import { featuresFromFlags, NONE } from "../Phases/addQuestions.js";

let dir;

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {});
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "ecadd-"));
});
afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));

function writeProject(pkg, files = {}) {
  fs.writeFileSync(
    path.join(dir, "package.json"),
    JSON.stringify(pkg, null, 2)
  );
  for (const [p, content] of Object.entries(files)) {
    const full = path.join(dir, p);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content);
  }
}

describe("ProjectContext", () => {
  it("detects pm from lockfile and language from tsconfig", () => {
    writeProject(
      { name: "x", dependencies: { express: "^4" } },
      { "pnpm-lock.yaml": "", "tsconfig.json": "{}" }
    );
    const ctx = ProjectContext.detect(dir);
    expect(ctx.packageManager).toBe("pnpm");
    expect(ctx.language).toBe("typescript");
    expect(ctx.hasDep("express")).toBe(true);
    expect(ctx.hasDep("mongoose")).toBe(false);
  });

  it("throws when no package.json", () => {
    expect(() => ProjectContext.detect(dir)).toThrow(/No package.json/);
  });

  it("reads existing env keys", () => {
    writeProject({ name: "x" }, { ".env": "PORT=3000\n# c\nFOO=bar\n" });
    const ctx = ProjectContext.detect(dir);
    expect(ctx.envKeys.has("PORT")).toBe(true);
    expect(ctx.envKeys.has("FOO")).toBe(true);
  });
});

describe("AddProject.computePlan", () => {
  function setup(pkg, files) {
    writeProject(pkg, files);
    const ctx = ProjectContext.detect(dir);
    const m = new Manifest({
      name: ctx.name,
      language: ctx.language,
      packageManager: ctx.packageManager,
      mode: "add",
    });
    return { ctx, m };
  }

  it("skips deps already present, adds missing", () => {
    const { ctx, m } = setup({
      name: "x",
      dependencies: { express: "^4", mongoose: "^8" },
    });
    new DatabaseSetup(m, "mongodb", "mongoose").register();
    const adder = new AddProject(m, ctx, {});
    const plan = adder.computePlan();
    expect(plan.depsSkipped).toContain("mongoose");
    expect(plan.depsToAdd.map(([n]) => n)).not.toContain("mongoose");
  });

  it("skips existing files but writes new ones", () => {
    const { ctx, m } = setup(
      { name: "x" },
      { "src/config/db.js": "// mine\n" }
    );
    new DatabaseSetup(m, "mongodb", "mongoose").register();
    const adder = new AddProject(m, ctx, {});
    const plan = adder.computePlan();
    expect(plan.filesSkipped).toContain("src/config/db.js");
    // original file untouched after apply
    adder.apply(plan);
    expect(fs.readFileSync(path.join(dir, "src/config/db.js"), "utf8")).toBe(
      "// mine\n"
    );
  });

  it("only adds missing env keys", () => {
    const { ctx, m } = setup({ name: "x" }, { ".env": "MONGO_URI=existing\n" });
    new DatabaseSetup(m, "mongodb", "mongoose").register();
    const plan = new AddProject(m, ctx, {}).computePlan();
    expect(plan.envToAdd.find((e) => e.key === "MONGO_URI")).toBeUndefined();
  });

  it("flags script conflicts and keeps theirs without --force", () => {
    const { ctx, m } = setup({ name: "x", scripts: { test: "mine" } });
    new TestFramework(m, "jest").register();
    const adder = new AddProject(m, ctx, {});
    const plan = adder.computePlan();
    expect(plan.scriptsConflict.some((c) => c.name === "test")).toBe(true);
    expect(plan.scriptsToAdd.test).toBeUndefined();
    adder.apply(plan);
    const pkg = JSON.parse(
      fs.readFileSync(path.join(dir, "package.json"), "utf8")
    );
    expect(pkg.scripts.test).toBe("mine");
    expect(fs.existsSync(path.join(dir, "package.json.bak"))).toBe(true);
  });

  it("apply merges deps and writes setup guide for wiring", () => {
    const { ctx, m } = setup({ name: "x", dependencies: { express: "^4" } });
    new DatabaseSetup(m, "mongodb", "mongoose").register();
    const adder = new AddProject(m, ctx, {});
    adder.apply(adder.computePlan());
    const pkg = JSON.parse(
      fs.readFileSync(path.join(dir, "package.json"), "utf8")
    );
    expect(pkg.dependencies.mongoose).toBeTruthy();
    expect(fs.existsSync(path.join(dir, "EXPRESSCRAFT_SETUP.md"))).toBe(true);
    expect(
      fs.readFileSync(path.join(dir, "EXPRESSCRAFT_SETUP.md"), "utf8")
    ).toContain("connectDB");
  });
});

describe("featuresFromFlags", () => {
  it("maps flags and defaults the rest to none", () => {
    const f = featuresFromFlags({
      database: "postgresql",
      authentication: "jwt",
    });
    expect(f.database).toBe("postgresql");
    expect(f.authentication).toBe("jwt");
    expect(f.testing).toBe(NONE.testing);
  });
});
