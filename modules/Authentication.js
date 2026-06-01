import chalk from "chalk";

export default class Authentication {
  constructor(manifest, authentication) {
    this.manifest = manifest;
    this.authentication = authentication; // "passport" | "jwt" | "no authentication"
  }

  register() {
    switch (this.authentication) {
      case "passport":
        return this.passport();
      case "jwt":
        return this.jwt();
      case "no authentication":
      default:
        console.log(chalk.yellow("🔔 No Authentication selected."));
    }
  }

  passport() {
    const m = this.manifest;
    m.addDeps("passport passport-local express-session");
    if (m.isTs())
      m.addDeps(
        "@types/passport @types/passport-local @types/express-session",
        { dev: true }
      );
    m.addEnv("SESSION_SECRET", "change-me", "Express session secret");

    m.addFile(
      `src/config/passport.${m.ext()}`,
      m.isTs()
        ? `import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

passport.use(
  new LocalStrategy((username, password, done) => {
    // TODO: look up the user and verify the password
    return done(null, { id: 1, username });
  })
);

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser((id: any, done) => done(null, { id }));

export default passport;
`
        : `const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy((username, password, done) => {
    // TODO: look up the user and verify the password
    return done(null, { id: 1, username });
  })
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => done(null, { id }));

module.exports = passport;
`
    );

    if (m.isTs()) {
      m.addAppImport(`import session from "express-session";`);
      m.addAppImport(`import passport from "./config/passport";`);
    } else {
      m.addAppImport(`const session = require("express-session");`);
      m.addAppImport(`const passport = require("./config/passport");`);
    }
    m.addAppSetup(
      `app.use(session({ secret: process.env.SESSION_SECRET || "change-me", resave: false, saveUninitialized: false }));`
    );
    m.addAppSetup(`app.use(passport.initialize());`);
    m.addAppSetup(`app.use(passport.session());`);
    console.log("✅ Passport.js registered and wired.");
  }

  jwt() {
    const m = this.manifest;
    m.addDeps("jsonwebtoken passport-jwt");
    if (m.isTs())
      m.addDeps("@types/jsonwebtoken @types/passport-jwt", { dev: true });
    m.addEnv("JWT_SECRET", "change-me", "Secret used to sign JWTs");

    m.addFile(
      `src/middleware/auth.${m.ext()}`,
      m.isTs()
        ? `import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;
  if (!header) {
    res.status(401).json({ error: "No token provided" });
    return;
  }
  try {
    (req as any).user = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET as string);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}
`
        : `const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    req.user = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = authenticate;
`
    );
    m.note(
      "Protect routes with the auth middleware in src/middleware/auth (import authenticate)."
    );
    console.log("✅ JWT registered.");
  }
}
