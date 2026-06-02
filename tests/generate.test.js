import { describe, it, expect, vi, beforeEach } from "vitest";
import Manifest from "../modules/Manifest.js";
import ProjectCreating from "../modules/ProjectCreating.js";
import TemplateEngine from "../modules/TemplateEngine.js";
import DatabaseSetup from "../modules/DatabaseSetup.js";
import TestFramework from "../modules/TestFramework.js";
import Authentication from "../modules/Authentication.js";
import Scaffold from "../modules/Scaffold.js";

beforeEach(() => vi.spyOn(console, "log").mockImplementation(() => {}));

function build(opts) {
  const m = new Manifest({
    name: "demo",
    language: opts.language,
    packageManager: opts.pm,
  });
  new ProjectCreating(m).register();
  new TemplateEngine(m, opts.te || "no template engine").register();
  new DatabaseSetup(
    m,
    opts.db || "no database",
    opts.orm || "no orm"
  ).register();
  new TestFramework(m, opts.test || "no testing").register();
  new Authentication(m, opts.auth || "no authentication").register();
  new Scaffold(m).register();
  return m;
}

const file = (m, p) => m.files.find((f) => f.path === p)?.content;

describe("generation pipeline", () => {
  it("JS sequelize+mysql installs mysql2 (regression for the capitalized-switch bug)", () => {
    const m = build({
      language: "javascript",
      pm: "npm",
      db: "mysql",
      orm: "sequelize",
    });
    expect(m.dependencies.has("mysql2")).toBe(true);
    expect(m.dependencies.has("sequelize")).toBe(true);
  });

  it("mocha test script is persisted (regression for missing writeFileSync)", () => {
    const m = build({
      language: "javascript",
      pm: "npm",
      test: "mocha + chai",
    });
    expect(m.scripts.test).toBe("mocha --reporter spec");
  });

  it("scaffold emits the structured source tree", () => {
    const m = build({ language: "javascript", pm: "npm" });
    const paths = m.files.map((f) => f.path);
    expect(paths).toEqual(
      expect.arrayContaining([
        "src/app.js",
        "src/index.js",
        "src/routes/index.js",
        "src/controllers/home.js",
        "src/middleware/errorHandler.js",
        ".env",
        ".env.example",
      ])
    );
    expect(file(m, "src/routes/index.js")).toContain("/health");
    expect(file(m, "src/controllers/home.js")).toContain("exports.health");
  });

  it("mongoose wires the connection into the server bootstrap", () => {
    const m = build({
      language: "javascript",
      pm: "npm",
      db: "mongodb",
      orm: "mongoose",
    });
    expect(file(m, "src/config/db.js")).toContain("mongoose.connect");
    expect(file(m, "src/index.js")).toContain("await connectDB()");
    expect(m.env.some((e) => e.key === "MONGO_URI")).toBe(true);
  });

  it("template engine wires app.set into app.js", () => {
    const m = build({ language: "javascript", pm: "npm", te: "ejs" });
    expect(file(m, "src/app.js")).toContain('app.set("view engine", "ejs")');
    expect(m.files.some((f) => f.path === "views/index.ejs")).toBe(true);
  });

  it("JWT auth generates middleware and JWT_SECRET env", () => {
    const m = build({ language: "typescript", pm: "pnpm", auth: "jwt" });
    expect(file(m, "src/middleware/auth.ts")).toContain("jwt.verify");
    expect(m.env.some((e) => e.key === "JWT_SECRET")).toBe(true);
  });

  it("TS scaffold uses .ts extensions and import syntax", () => {
    const m = build({ language: "typescript", pm: "npm" });
    expect(file(m, "src/app.ts")).toContain("import express");
    expect(m.files.some((f) => f.path === "tsconfig.json")).toBe(true);
  });
});
