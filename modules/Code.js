import { execSync } from "child_process";
import fs from "fs";

export default class Code {
  constructor(language, packageManager) {
    this.language = language;
    this.packageManager = packageManager;
  }

  typescriptExpressTemplate() {
    const sampleCode = `
import express, { Application, Request, Response } from 'express';

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

app.listen(port, () => {
    console.log(\`Server running on port \${port}\`);
});
            `;
    return sampleCode;
  }

  javascriptExpressTemplate() {
    const sampleCode = `
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, JavaScript with Express!');
});

app.listen(port, () => {
    console.log(\`Server running on port \${port}\`);
});
            `;
    return sampleCode;
  }

  /**
   * Create a src folder and create a index file
   */
  createSrcFolder() {
    fs.mkdirSync("src");
    if (this.language === "typescript") {
      fs.writeFileSync("src/index.ts", this.typescriptExpressTemplate());
    } else if (this.language === "javascript") {
      fs.writeFileSync("src/index.js", this.javascriptExpressTemplate());
    } else {
      console.log("❌ Language not supported");
      return;
    }
  }
}
