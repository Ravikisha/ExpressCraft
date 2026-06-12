/**
 * Builds the CLAUDE.md project guide. Written on every project creation so the
 * repo always carries baseline guidance for Claude Code; when the user also
 * picks the `claude` AI service, AIAssistants passes the generated skills so
 * they get listed too.
 *
 * ctx = { name, ext, lang }
 * skills = optional array of catalog skill objects (adds a "Skills" section)
 */
export function claudeGuide({ name, ext, lang }, skills = null) {
  const skillsSection =
    skills && skills.length
      ? `\n## Skills generated for this stack\n${skills
          .map((s) => `- **${s.label}** — \`.claude/skills/${s.id}/SKILL.md\``)
          .join("\n")}\n`
      : "";

  return `# ${name}

Express.js app written in ${lang}.

## Layout
- \`src/index.${ext}\` — server entry (app.listen)
- \`src/app.${ext}\` — express app, middleware wiring
- \`src/routes/\` — route definitions
- \`src/controllers/\` — request handlers
- \`src/middleware/\` — custom middleware

## Conventions
- Keep route files thin; put logic in controllers.
- Validate input at the route boundary; never trust req.body.
- Use async handlers and forward errors with \`next(err)\`.
- Read config and secrets from environment variables.
${skillsSection}`;
}
