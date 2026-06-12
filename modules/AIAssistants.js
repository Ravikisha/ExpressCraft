import chalk from "chalk";
import { CATALOG, skillIdsFor, sourceFor } from "./skillsCatalog.js";
import { claudeGuide } from "./claudeGuide.js";

/**
 * AIAssistants — scaffolds per-tool skills + agents for AI coding tools
 * (Claude Code, GitHub Copilot, Cursor, or a generic AGENTS.md).
 *
 * Which skills are generated is driven by the tools the user picked: choose
 * Prisma -> get a Prisma skill + agent, choose Jest -> a Jest skill + agent,
 * and so on (see skillsCatalog.js). Each selected AI service gets the same set
 * of skills rendered in its own file format.
 *
 * opts:
 *   services  string[]  ["claude","copilot","cursor","agents"]
 *   skillIds  string[]  explicit skill selection (null/undefined => all available)
 *   features  object    normalized features, used to derive skills when skillIds is absent
 */
export default class AIAssistants {
  constructor(manifest, { services = [], skillIds = null, features = {} } = {}) {
    this.m = manifest;
    this.services = Array.isArray(services) ? services : [];
    this.skillIds = skillIds;
    this.features = features || {};
  }

  register() {
    if (!this.services.length) {
      console.log(chalk.yellow("No AI assistant configs selected."));
      return;
    }

    const ctx = {
      name: this.m.name,
      ext: this.m.ext(),
      lang: this.m.isTs() ? "TypeScript" : "JavaScript",
    };

    const ids =
      this.skillIds != null ? this.skillIds : skillIdsFor(this.features);
    const skills = [...new Set(ids)].map((id) => CATALOG[id]).filter(Boolean);

    if (!skills.length) {
      console.log(chalk.yellow("No AI skills matched the selected tools."));
      return;
    }

    const renderers = {
      claude: () => this.claude(skills, ctx),
      copilot: () => this.copilot(skills, ctx),
      cursor: () => this.cursor(skills, ctx),
      agents: () => this.agentsMd(skills, ctx),
    };

    const agentCount = skills.filter((s) => s.agent).length;
    for (const svc of this.services) {
      const render = renderers[svc];
      if (render) render();
    }

    // Provenance doc + honest notes about what was/wasn't downloaded.
    this.m.addFile("AI_SKILLS.md", this.sourcesDoc(skills, ctx));

    const official = skills
      .map((s) => ({ s, src: sourceFor(s.id) }))
      .filter((x) => x.src.official);

    console.log(
      chalk.green(
        `✅ AI configs: ${skills.length} skill(s) + ${agentCount} agent(s) for ${this.services.join(", ")}.`
      )
    );
    this.m.note(
      "AI skills/agents are ExpressCraft-authored starters, NOT downloaded from officialskills.sh — see AI_SKILLS.md for sources and how to fetch official versions."
    );
    if (official.length) {
      this.m.note(
        `${official.length} of your tools have an official skill. Download them with --fetch-skills, or run the commands listed in AI_SKILLS.md.`
      );
    }
  }

  // Blockquote prepended to every generated skill file: says where it came
  // from and how to get the official version.
  provenance(skill) {
    const src = sourceFor(skill.id);
    if (src.official) {
      return [
        "> **An official skill exists for this tool.** The content below is an",
        "> ExpressCraft starter summary — NOT the official skill.",
        `> Download the canonical, maintained version: \`${src.install}\``,
        `> Source: ${src.url}`,
        "",
        "",
      ].join("\n");
    }
    return [
      '> **ExpressCraft starter skill** — authored locally, not downloaded.',
      `> No official skill is published for "${skill.id}". Browse the registry`,
      `> for one and install it with \`npx skills add <repo-url> --skill <name>\`:`,
      `> ${src.browse}`,
      "",
      "",
    ].join("\n");
  }

  // ---- shared markdown helpers -----------------------------------------
  bullets(arr) {
    return arr.map((b) => `- ${b}`).join("\n");
  }

  skillMd(skill, ctx) {
    return `${this.provenance(skill)}# ${skill.label}\n\n${skill.description(
      ctx
    )}\n\n${this.bullets(skill.body(ctx))}\n`;
  }

  agentMd(skill, ctx) {
    return `${this.provenance(skill)}${skill.agent.persona(ctx).join("\n")}\n`;
  }

  // ---- Claude Code -----------------------------------------------------
  claude(skills, ctx) {
    const m = this.m;

    for (const s of skills) {
      m.addFile(
        `.claude/skills/${s.id}/SKILL.md`,
        `---\nname: ${s.id}\ndescription: ${s.description(ctx)}\n---\n\n${this.skillMd(
          s,
          ctx
        )}`
      );
      if (s.agent) {
        m.addFile(
          `.claude/agents/${s.id}-agent.md`,
          `---\nname: ${s.id}-agent\ndescription: ${s.agent.description(
            ctx
          )}\ntools: Read, Grep, Glob\n---\n\n${this.agentMd(s, ctx)}`
        );
      }
    }

    m.addFile("CLAUDE.md", claudeGuide(ctx, skills));
    console.log(chalk.green("  • Claude skills + agents written."));
  }

  // ---- GitHub Copilot --------------------------------------------------
  copilot(skills, ctx) {
    const m = this.m;

    m.addFile(
      ".github/copilot-instructions.md",
      this.indexDoc("Copilot instructions", skills, ctx, "copilot")
    );

    for (const s of skills) {
      m.addFile(
        `.github/prompts/${s.id}.prompt.md`,
        `---\nmode: agent\ndescription: ${s.description(ctx)}\n---\n\n${this.skillMd(
          s,
          ctx
        )}`
      );
      if (s.agent) {
        m.addFile(
          `.github/chatmodes/${s.id}.chatmode.md`,
          `---\ndescription: ${s.agent.description(
            ctx
          )}\ntools: ['codebase', 'search']\n---\n\n${this.agentMd(s, ctx)}`
        );
      }
    }
    console.log(chalk.green("  • Copilot prompts + chat modes written."));
  }

  // ---- Cursor ----------------------------------------------------------
  cursor(skills, ctx) {
    const m = this.m;
    const fm = (desc, glob) =>
      `---\ndescription: ${desc}\nglobs: ${glob}\nalwaysApply: false\n---\n\n`;

    for (const s of skills) {
      const glob = s.glob || "src/**/*.{js,ts}";
      m.addFile(
        `.cursor/rules/${s.id}.mdc`,
        fm(s.description(ctx), glob) + this.skillMd(s, ctx)
      );
      if (s.agent) {
        m.addFile(
          `.cursor/rules/${s.id}-agent.mdc`,
          fm(s.agent.description(ctx), glob) + this.agentMd(s, ctx)
        );
      }
    }
    console.log(chalk.green("  • Cursor rules written."));
  }

  // ---- Generic AGENTS.md (one aggregated file) -------------------------
  agentsMd(skills, ctx) {
    const parts = [
      `# AGENTS.md — ${ctx.name}`,
      `Express.js (${ctx.lang}) project. Skills and agents for AI coding tools, generated from the selected stack.`,
      `## Skills`,
    ];
    for (const s of skills) {
      parts.push(
        `### ${s.label}\n${s.description(ctx)}\n\n${this.bullets(s.body(ctx))}`
      );
    }
    const agents = skills.filter((s) => s.agent);
    if (agents.length) {
      parts.push(`## Agents`);
      for (const s of agents) {
        parts.push(
          `### ${s.id}-agent\n${s.agent.description(ctx)}\n\n${s.agent
            .persona(ctx)
            .join("\n")}`
        );
      }
    }
    this.m.addFile("AGENTS.md", parts.join("\n\n") + "\n");
    console.log(chalk.green("  • AGENTS.md written."));
  }

  // ---- provenance / sources doc ----------------------------------------
  sourcesDoc(skills, ctx) {
    const rows = skills.map((s) => {
      const src = sourceFor(s.id);
      const source = src.official
        ? `[official](${src.url})`
        : `[browse](${src.browse})`;
      const cmd = src.official ? `\`${src.install}\`` : "— (authored locally)";
      return `| ${s.label} | ${source} | ${cmd} |`;
    });

    const installs = [
      ...new Set(
        skills
          .map((s) => sourceFor(s.id))
          .filter((src) => src.official)
          .map((src) => src.install)
      ),
    ];
    const installBlock = installs.length
      ? installs.join("\n")
      : "# (none of your selected tools have an official skill yet)";

    return `# AI skills — sources & provenance (${ctx.name})

**The skill/agent files in this project are ExpressCraft-authored starters.**
They were written by the generator, **not downloaded** from a registry.

Official, community-maintained skills live at https://officialskills.sh and are
installed with the \`skills\` CLI:

\`\`\`bash
npx skills add <github-repo-url> --skill <skill-name>
\`\`\`

ExpressCraft can fetch the official skills for you — re-run generation with
\`--fetch-skills\` (create or add mode), or run the commands below by hand.

## Fetch the official skills matching your stack

\`\`\`bash
${installBlock}
\`\`\`

## Per-skill sources

| Skill | Source | Install official version |
| ----- | ------ | ------------------------ |
${rows.join("\n")}

Where a skill has no official source, the ExpressCraft starter is a reasonable
baseline — search the registry above if you want to swap in a maintained one.
`;
  }

  // ---- project index doc (CLAUDE.md / copilot-instructions.md) ---------
  indexDoc(title, skills, ctx, service) {
    const where = {
      claude: (s) => `.claude/skills/${s.id}/SKILL.md`,
      copilot: (s) => `.github/prompts/${s.id}.prompt.md`,
    }[service];

    const list = skills
      .map((s) => `- **${s.label}** — \`${where(s)}\``)
      .join("\n");

    return `# ${title} — ${ctx.name}

Express.js app written in ${ctx.lang}.

## Layout
- \`src/index.${ctx.ext}\` — server entry (app.listen)
- \`src/app.${ctx.ext}\` — express app, middleware wiring
- \`src/routes/\` — route definitions
- \`src/controllers/\` — request handlers
- \`src/middleware/\` — custom middleware

## Conventions
- Keep route files thin; put logic in controllers.
- Validate input at the route boundary; never trust req.body.
- Use async handlers and forward errors with \`next(err)\`.
- Read config and secrets from environment variables.

## Skills generated for this stack
${list}
`;
  }
}
