import { describe, it, expect, vi, beforeEach } from "vitest";
import Manifest from "../modules/Manifest.js";
import Docker from "../modules/Docker.js";
import CI from "../modules/CI.js";
import GitHooks from "../modules/GitHooks.js";
import Logger from "../modules/Logger.js";

beforeEach(() => vi.spyOn(console, "log").mockImplementation(() => {}));

const make = (over = {}) =>
  new Manifest({
    name: "demo",
    language: "javascript",
    packageManager: "npm",
    ...over,
  });

const file = (m, p) => m.files.find((f) => f.path === p)?.content;

describe("Docker", () => {
  it("does nothing when disabled", () => {
    const m = make();
    new Docker(m, { enabled: false, database: "no database" }).register();
    expect(m.files).toHaveLength(0);
  });

  it("emits Dockerfile + compose with a db service for postgres", () => {
    const m = make();
    new Docker(m, { enabled: true, database: "postgresql" }).register();
    expect(file(m, "Dockerfile")).toContain("FROM node:20-alpine");
    expect(file(m, ".dockerignore")).toContain("node_modules");
    const compose = file(m, "docker-compose.yml");
    expect(compose).toContain("postgres:16-alpine");
    expect(compose).toContain("depends_on");
  });

  it("omits the db service when no database", () => {
    const m = make();
    new Docker(m, { enabled: true, database: "no database" }).register();
    expect(file(m, "docker-compose.yml")).not.toContain("depends_on");
  });

  it("TS Dockerfile builds and runs dist", () => {
    const m = make({ language: "typescript" });
    new Docker(m, { enabled: true, database: "no database" }).register();
    expect(file(m, "Dockerfile")).toContain("RUN npm run build");
    expect(file(m, "Dockerfile")).toContain('CMD ["node", "dist/index.js"]');
  });
});

describe("CI", () => {
  it("includes only the scripts that exist", () => {
    const m = make();
    m.setScript("test", "vitest");
    m.setScript("lint", "eslint .");
    new CI(m, { enabled: true }).register();
    const yml = file(m, ".github/workflows/ci.yml");
    expect(yml).toContain("npm run lint");
    expect(yml).toContain("npm test");
    expect(yml).not.toContain("npm run build");
  });

  it("adds a pnpm setup step for pnpm projects", () => {
    const m = make({ packageManager: "pnpm" });
    new CI(m, { enabled: true }).register();
    expect(file(m, ".github/workflows/ci.yml")).toContain("pnpm/action-setup");
  });
});

describe("GitHooks", () => {
  it("registers husky/lint-staged, prepare script and hook file", () => {
    const m = make();
    new GitHooks(m, { enabled: true }).register();
    expect(m.devDependencies.has("husky")).toBe(true);
    expect(m.devDependencies.has("lint-staged")).toBe(true);
    expect(m.scripts.prepare).toBe("husky");
    expect(file(m, ".husky/pre-commit")).toContain("lint-staged");
    expect(file(m, ".lintstagedrc.json")).toContain("prettier");
  });
});

describe("Logger", () => {
  it("adds pino deps and an app.use fragment", () => {
    const m = make();
    new Logger(m, { enabled: true }).register();
    expect(m.dependencies.has("pino")).toBe(true);
    expect(m.dependencies.has("pino-http")).toBe(true);
    expect(m.appSetup.join("\n")).toContain("app.use(pinoHttp())");
  });
});
