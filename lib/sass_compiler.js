const sass = require('node-sass');
const glob = require('glob');
const fs = require('fs');
const path = require('path');

// Define the source and destination directories
const sourceDir = 'styles';
const destDir = 'public/css';

// Define the file pattern for Sass files
const sassPattern = `${sourceDir}/**/*.scss`;

// Find all Sass files in the source directory
const sassFiles = glob.sync(sassPattern);

// Compile each Sass file to CSS
sassFiles.forEach((file) => {
  const sourcePath = path.resolve(file);
  const fileName = path.basename(file, path.extname(file));
  const destPath = path.resolve(destDir, `${fileName}.css`);

  const result = sass.renderSync({
    file: sourcePath,
    outputStyle: 'compressed', // Options: 'nested', 'expanded', 'compact', 'compressed'
  });

  fs.writeFileSync(destPath, result.css);

  console.log(`Compiled: ${sourcePath} -> ${destPath}`);
});

console.log('Sass compilation complete.');
