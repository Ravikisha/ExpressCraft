import { describe, it, expect } from "vitest";
import Manifest from "../modules/Manifest.js";

const make = (over = {}) =>
  new Manifest({
    name: "demo",
    language: "javascript",
    packageManager: "npm",
    ...over,
  });

describe("Manifest", () => {
  it("pins known deps and falls back to latest otherwise", () => {
    const m = make();
    m.addDep("express");
    m.addDep("totally-unknown-pkg");
    const pkg = m.toPackageJson();
    expect(pkg.dependencies.express).toBe("^4.19.2");
    expect(pkg.dependencies["totally-unknown-pkg"]).toBe("latest");
  });

  it("dedupes and sorts dependencies", () => {
    const m = make();
    m.addDeps("b a a");
    expect(Object.keys(m.toPackageJson().dependencies)).toEqual(["a", "b"]);
  });

  it("appendScript chains with &&", () => {
    const m = make();
    m.appendScript("build", "tsc");
    m.appendScript("build", "echo done");
    expect(m.scripts.build).toBe("tsc && echo done");
  });

  it("runCommand differs per package manager", () => {
    expect(make({ packageManager: "npm" }).runCommand("dev")).toBe(
      "npm run dev"
    );
    expect(make({ packageManager: "npm" }).runCommand("start")).toBe(
      "npm start"
    );
    expect(make({ packageManager: "yarn" }).runCommand("dev")).toBe("yarn dev");
    expect(make({ packageManager: "pnpm" }).runCommand("build")).toBe(
      "pnpm build"
    );
  });

  it("addEnv ignores duplicate keys", () => {
    const m = make();
    m.addEnv("PORT", "3000");
    m.addEnv("PORT", "4000");
    expect(m.env).toHaveLength(1);
    expect(m.env[0].value).toBe("3000");
  });

  it("main path depends on language", () => {
    expect(make({ language: "typescript" }).toPackageJson().main).toBe(
      "dist/index.js"
    );
    expect(make({ language: "javascript" }).toPackageJson().main).toBe(
      "src/index.js"
    );
  });
});
