// Compiles styles/**/*.scss -> public/css/*.css using Dart Sass.
const sass = require("sass");
const { globSync } = require("glob");
const fs = require("fs");
const path = require("path");

const sourceDir = "styles";
const destDir = "public/css";

fs.mkdirSync(destDir, { recursive: true });

const sassFiles = globSync(`${sourceDir}/**/*.scss`);

sassFiles.forEach((file) => {
  const result = sass.compile(path.resolve(file), { style: "compressed" });
  const fileName = path.basename(file, path.extname(file));
  const destPath = path.join(destDir, `${fileName}.css`);
  fs.writeFileSync(destPath, result.css);
  console.log(`Compiled: ${file} -> ${destPath}`);
});

console.log("Sass compilation complete.");
