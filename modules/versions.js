/**
 * Known-good version ranges for generated projects. Pinning beats "latest":
 * reproducible installs and no surprise major bumps. Anything not listed here
 * falls back to "latest" in Manifest.addDep.
 */
export default {
  // core
  express: "^4.19.2",
  nodemon: "^3.1.0",
  dotenv: "^16.4.5",
  helmet: "^7.1.0",
  cors: "^2.8.5",
  morgan: "^1.10.0",

  // typescript
  typescript: "^5.4.0",
  "ts-node": "^10.9.2",
  "@types/express": "^4.17.21",
  "@types/node": "^20.12.0",
  "@types/cors": "^2.8.17",
  "@types/morgan": "^1.9.9",

  // template engines
  ejs: "^3.1.10",
  pug: "^3.0.3",
  twig: "^1.17.1",
  handlebars: "^4.7.8",

  // css
  tailwindcss: "^4.0.0",
  "@tailwindcss/cli": "^4.0.0",
  bootstrap: "^5.3.3",
  jquery: "^3.7.1",
  "popper.js": "^1.16.1",
  bulma: "^1.0.0",
  "foundation-sites": "^6.8.1",
  "materialize-css": "^1.0.0",
  "fomantic-ui": "^2.9.3",

  // preprocessors
  sass: "^1.77.0",
  glob: "^10.3.0",
  less: "^4.2.0",
  stylus: "^0.63.0",
  postcss: "^8.4.38",
  "postcss-cli": "^11.0.0",

  // databases / orm
  "@prisma/client": "^5.13.0",
  prisma: "^5.13.0",
  sequelize: "^6.37.0",
  "sequelize-typescript": "^2.1.6",
  "@types/sequelize": "^4.28.20",
  typeorm: "^0.3.20",
  "reflect-metadata": "^0.2.2",
  "drizzle-orm": "^0.30.0",
  "drizzle-kit": "^0.20.0",
  mongoose: "^8.3.0",
  mysql2: "^3.9.0",
  pg: "^8.11.0",
  "pg-hstore": "^2.3.4",
  sqlite3: "^5.1.7",
  "better-sqlite3": "^11.0.0",

  // testing
  jest: "^29.7.0",
  "ts-jest": "^29.1.2",
  supertest: "^7.0.0",
  "cross-env": "^7.0.3",
  "@types/jest": "^29.5.12",
  "@types/supertest": "^6.0.2",
  mocha: "^10.4.0",
  chai: "^5.1.0",
  "@types/mocha": "^10.0.6",
  "@types/chai": "^4.3.14",
  jasmine: "^5.1.0",
  "@types/jasmine": "^5.1.4",

  // auth
  passport: "^0.7.0",
  "passport-local": "^1.0.0",
  "express-session": "^1.18.0",
  jsonwebtoken: "^9.0.2",
  "passport-jwt": "^4.0.1",
  "@types/passport": "^1.0.16",
  "@types/passport-local": "^1.0.38",
  "@types/express-session": "^1.18.0",
  "@types/jsonwebtoken": "^9.0.6",
  "@types/passport-jwt": "^4.0.1",

  // linting
  eslint: "^8.57.0",
  "@typescript-eslint/parser": "^7.7.0",
  "@typescript-eslint/eslint-plugin": "^7.7.0",

  // docs
  "swagger-ui-express": "^5.0.0",
  "@types/swagger-ui-express": "^4.1.6",
  newman: "^6.1.0",
};
