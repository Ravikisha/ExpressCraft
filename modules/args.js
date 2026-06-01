/**
 * Minimal CLI flag parser (no dependency). Enables non-interactive use:
 *   expresscraft --preset api --name my-api --yes
 */
export function parseArgs(argv = process.argv.slice(2)) {
  const out = {
    preset: null,
    name: null,
    pm: null,
    language: null,
    yes: false,
    force: false,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    switch (a) {
      case "-p":
      case "--preset":
        out.preset = next();
        break;
      case "-n":
      case "--name":
        out.name = next();
        break;
      case "--pm":
        out.pm = next();
        break;
      case "--ts":
        out.language = "typescript";
        break;
      case "--js":
        out.language = "javascript";
        break;
      case "-y":
      case "--yes":
        out.yes = true;
        break;
      case "-f":
      case "--force":
        out.force = true;
        break;
      case "-h":
      case "--help":
        out.help = true;
        break;
      default:
        // bare token -> project name shorthand
        if (!a.startsWith("-") && !out.name) out.name = a;
    }
  }
  return out;
}

export const HELP = `
ExpressCraft — Express.js project generator

Usage:
  expresscraft [name] [options]

Options:
  -n, --name <name>      Project name
  -p, --preset <name>    Preset: minimal | api | mvc | fullstack
      --pm <manager>     Package manager: npm | yarn | pnpm
      --ts | --js        Language (TypeScript / JavaScript)
  -y, --yes              Non-interactive (use preset/flag defaults)
  -f, --force            Overwrite an existing folder without asking
  -h, --help             Show this help

Examples:
  expresscraft my-api --preset api --yes
  expresscraft --name blog --preset mvc --pm pnpm -y
`;
