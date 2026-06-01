import fs from "fs";

/**
 * Create the project directory and chdir into it.
 * No `npm init` here — package.json is authored from the Manifest later.
 * With { overwrite }, an existing folder is removed first.
 * Throws on failure so the caller can roll back / abort.
 */
export default function folderCreating(
  projectName,
  { overwrite = false } = {}
) {
  if (overwrite && fs.existsSync(projectName)) {
    fs.rmSync(projectName, { recursive: true, force: true });
  }
  fs.mkdirSync(projectName);
  process.chdir(projectName);
  console.log("✅ Folder created.");
}
