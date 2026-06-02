import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";
import Injector from "../modules/Injector.js";

let dir;
beforeEach(() => (dir = fs.mkdtempSync(path.join(os.tmpdir(), "ecinj-"))));
afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));

const ctx = (entryFile) => ({ cwd: dir, language: "javascript", entryFile });

function write(p, content) {
  const full = path.join(dir, p);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

describe("Injector", () => {
  it("inserts imports after last require and middleware after last app.use", () => {
    write(
      "app.js",
      [
        'const express = require("express");',
        "const app = express();",
        "app.use(express.json());",
        "app.listen(3000);",
        "",
      ].join("\n")
    );
    const res = new Injector(ctx("app.js")).inject({
      appImports: ['const helmet = require("helmet");'],
      appSetup: ["app.use(helmet());"],
    });
    expect(res.appImportsInjected).toBe(true);
    expect(res.appSetupInjected).toBe(true);
    const out = fs.readFileSync(path.join(dir, "app.js"), "utf8");
    expect(out).toContain('const helmet = require("helmet");');
    expect(out).toContain("app.use(helmet());");
    // backup written
    expect(fs.existsSync(path.join(dir, "app.js.bak"))).toBe(true);
    // import lands before middleware
    expect(out.indexOf('require("helmet")')).toBeLessThan(
      out.indexOf("app.use(helmet())")
    );
  });

  it("renames the app. prefix to the real variable name", () => {
    write(
      "server.js",
      'const express = require("express");\nconst server = express();\nserver.listen(3000);\n'
    );
    new Injector(ctx("server.js")).inject({
      appImports: [],
      appSetup: ["app.use(cors());"],
    });
    const out = fs.readFileSync(path.join(dir, "server.js"), "utf8");
    expect(out).toContain("server.use(cors());");
    expect(out).not.toContain("app.use(cors());");
  });

  it("does nothing when there is no express() app", () => {
    write("random.js", "console.log('hi');\n");
    const res = new Injector(ctx("random.js")).inject({
      appImports: ['const x = require("x");'],
      appSetup: ["app.use(x());"],
    });
    expect(res.file).toBeNull();
    expect(fs.existsSync(path.join(dir, "random.js.bak"))).toBe(false);
  });

  it("is idempotent — does not duplicate already-present lines", () => {
    write(
      "app.js",
      'const express = require("express");\nconst helmet = require("helmet");\nconst app = express();\napp.use(helmet());\napp.listen(3000);\n'
    );
    const res = new Injector(ctx("app.js")).inject({
      appImports: ['const helmet = require("helmet");'],
      appSetup: ["app.use(helmet());"],
    });
    expect(res.appImportsInjected).toBe(true);
    expect(res.appSetupInjected).toBe(true);
    const out = fs.readFileSync(path.join(dir, "app.js"), "utf8");
    expect(out.match(/require\("helmet"\)/g)).toHaveLength(1);
    expect(out.match(/app\.use\(helmet\(\)\)/g)).toHaveLength(1);
    // unchanged → no backup
    expect(fs.existsSync(path.join(dir, "app.js.bak"))).toBe(false);
  });
});
