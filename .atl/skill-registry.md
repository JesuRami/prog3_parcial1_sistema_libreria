# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Skill | Trigger | Level | Path |
|-------|---------|-------|------|
| accessibility | "improve accessibility", "a11y audit", "WCAG compliance", "screen reader support", "keyboard navigation", "make accessible" | project | `C:\Users\DWIOL-11-001816\Downloads\bd\prog3_parcial1_sistema_libreria\.opencode\skills\accessibility\SKILL.md` |
| documentation | "write docs for", "document this", "create a README", "write a runbook", "onboarding guide" | project | `C:\Users\DWIOL-11-001816\Downloads\bd\prog3_parcial1_sistema_libreria\.opencode\skills\documentation\SKILL.md` |
| html | semantic HTML markup, document structure, forms, accessibility attributes, modern HTML best practices | project | `C:\Users\DWIOL-11-001816\Downloads\bd\prog3_parcial1_sistema_libreria\.opencode\skills\html\SKILL.md` |
| openspec-apply-change | "openspec apply", "opsx apply", "openspec implement" | project | `C:\Users\DWIOL-11-001816\Downloads\bd\prog3_parcial1_sistema_libreria\.opencode\skills\openspec-apply-change\SKILL.md` |
| openspec-archive-change | "openspec archive" or "opsx archive" | project | `C:\Users\DWIOL-11-001816\Downloads\bd\prog3_parcial1_sistema_libreria\.opencode\skills\openspec-archive-change\SKILL.md` |
| openspec-explore | "openspec explore" or "opsx explore" | project | `C:\Users\DWIOL-11-001816\Downloads\bd\prog3_parcial1_sistema_libreria\.opencode\skills\openspec-explore\SKILL.md` |
| openspec-propose | "openspec propose" or "opsx propose" | project | `C:\Users\DWIOL-11-001816\Downloads\bd\prog3_parcial1_sistema_libreria\.opencode\skills\openspec-propose\SKILL.md` |
| openspec-sync-specs | "openspec sync" or "opsx sync" | project | `C:\Users\DWIOL-11-001816\Downloads\bd\prog3_parcial1_sistema_libreria\.opencode\skills\openspec-sync-specs\SKILL.md` |
| openspec-update-change | "openspec update change" or "opsx update" | project | `C:\Users\DWIOL-11-001816\Downloads\bd\prog3_parcial1_sistema_libreria\.opencode\skills\openspec-update-change\SKILL.md` |
| qa-test-planner | explicit only (`/qa-test-planner`, "use the skill qa-test-planner") | project | `C:\Users\DWIOL-11-001816\Downloads\bd\prog3_parcial1_sistema_libreria\.opencode\skills\qa-test-planner\SKILL.md` |
| responsive-design | building adaptive interfaces, fluid layouts, component-level responsive behavior | project | `C:\Users\DWIOL-11-001816\Downloads\bd\prog3_parcial1_sistema_libreria\.opencode\skills\responsive-design\SKILL.md` |
| web-design-guidelines | "review my UI", "check accessibility", "audit design", "review UX", "check my site against best practices" | project | `C:\Users\DWIOL-11-001816\Downloads\bd\prog3_parcial1_sistema_libreria\.opencode\skills\web-design-guidelines\SKILL.md` |
| active-orchestrator | /active-orchestrator:init, :kb, :rules, :discovery, :openspec, :devops, :find-skill — start a new project from scratch via SDD/OpenSpec foundation flow | global | `C:\Users\DWIOL-11-001816\.config\opencode\skills\active-orchestrator\SKILL.md` |
| agent-instruction (agents-md-generator) | create/generate/update AGENTS.md or CLAUDE.md, "armar las reglas del proyecto", "instrucciones para los agentes", "generar claude.md", after kb-creator + roadmap-generator | global | `C:\Users\DWIOL-11-001816\.config\opencode\skills\agent-instruction\SKILL.md` |
| discovery-research | discovery phase of foundation flow, market research before KB, "investigar el mercado/pensar qué construir" | global | `C:\Users\DWIOL-11-001816\.config\opencode\skills\discovery-research\SKILL.md` |
| find-skills | "how do I do X", "find a skill for X", "is there a skill that can...", extending capabilities | global | `C:\Users\DWIOL-11-001816\.config\opencode\skills\find-skill\SKILL.md` |
| kb-creator | create/build/generate a knowledge base, document from source docs (.txt/.docx/.pdf), "armar base de conocimiento" / "crear KB" / "documentar proyecto" | global | `C:\Users\DWIOL-11-001816\.config\opencode\skills\kb-creator\SKILL.md` |
| roadmap-generator | create/build/regenerate/update CHANGES.md, roadmap, change map, implementation plan; "armar CHANGES", "armar roadmap", "crear mapa de changes" | global | `C:\Users\DWIOL-11-001816\.config\opencode\skills\roadmap-generator\SKILL.md` |
| skill-creator | create a skill from scratch, edit or optimize an existing skill, run evals, benchmark skill performance, optimize description triggering | global | `C:\Users\DWIOL-11-001816\.config\opencode\skills\skill-creator\SKILL.md` |
| web-scraper | investigate/scrape a competitor from a URL, or invoked by discovery-research as sub-skill during Discovery | global | `C:\Users\DWIOL-11-001816\.config\opencode\skills\web-scraper\SKILL.md` |

> Note: `customize-opencode` is a built-in registered in code with no SKILL.md on disk — it does not appear here by design.

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### accessibility
- Audit with live Lighthouse/axe when available; a score of 100 is NOT WCAG conformance — use issue-level evidence
- Prefer native HTML elements over ARIA; use ARIA only when native semantics are insufficient and match actual element behavior
- Target WCAG 2.2 AA: contrast 4.5:1 normal text, 3:1 large text (≥18px / ≥14px bold) and UI components
- Every image needs alt text; use `alt=""` + `role="presentation"` for decorative images
- Icon buttons need accessible names (`aria-label` or visually-hidden text); decorative SVGs get `aria-hidden="true"`
- Keyboard: no traps, logical focus order matching visual order, visible focus indicators; interactive targets ≥24×24px (WCAG 2.2)
- Fix critical immediately: missing form labels, missing alt, low contrast, keyboard traps, no focus indicators
- Use `aria-live` regions for dynamic content updates without moving focus

### documentation
- Write for the reader; lead with the most useful information (don't bury the lede)
- README structure: what/why it exists, quick start (<5 min), configuration, contributing
- Show, don't tell — include code examples, commands, screenshots
- Outdated docs are worse than no docs — keep current
- Link, don't duplicate — reference other docs instead of copying content
- Match structure to audience/purpose: README, API reference, runbook, architecture doc, or onboarding guide

### html
- Write semantic HTML; use elements for their intended purpose only
- One `<h1>` per page; maintain heading hierarchy; all content within landmark regions
- `<button>` for actions, `<a href>` for navigation; never `<div>`/`<span>` as clickable elements
- Always include `alt` on images (empty for decorative); `width`/`height` to prevent layout shift
- Forms: associate labels via `for`, use proper input types, group with `<fieldset>`/`<legend>`, include validation attributes (`required`, `pattern`, `min`, `max`)
- Prefer native elements over ARIA; ARIA attributes must match actual element behavior
- Avoid deprecated styling elements (`<font>`, `<center>`, `<b>`, `<i>`) — use CSS + `<strong>`/`<em>`
- Include `<!DOCTYPE html>`, `lang` attribute, viewport meta tag

### openspec-apply-change
- Use `openspec status --change --json` before implementing; never assume schema or artifact names
- Read every path in `contextFiles` from apply instructions before starting; never assume file names
- Mark task `- [x]` ONLY when its specified behavior is fully implemented — never partial or deferred
- Update the checkbox at the exact `sourcePath` + line returned by the CLI; re-run instructions if location drifts
- Keep code changes minimal and scoped to each task
- Pause on ambiguity, blockers, or design issues — never silently narrow, defer, or accept exceptions to specified behavior
- If `state: "blocked"`, complete missing artifacts first; do not start implementation
- Never use context or operationGuidance as proof that a task is complete

### openspec-archive-change
- Announce the selected change; prompt when ambiguous; show only active (non-archived) changes
- Artifact completion from `openspec status --json`; task completion only from `openspec list --json` counts (x/X checkboxes) — never inferred from artifact status
- On incomplete artifacts/tasks: warn, confirm with user, then proceed
- If delta specs exist, always run the sync assessment and show the combined summary before prompting
- Run the `openspec-sync-specs` workflow INLINE and wait for it to finish — never delegate sync to a background task
- Never archive while a spec sync is still in flight
- Archive target: `YYYY-MM-DD-<change-name>` (never stack a second date); fail if target already exists
- Preserve `.openspec.yaml`; move the whole `changeRoot` into the archive directory
- Never copy runtime context, operation guidance, or artifact-rule text verbatim into output files

### openspec-explore
- Explore mode is thinking, not implementing — never write code or implement features
- May read files, search code, and run read-only commands/tools without confirmation
- Before ANY write-capable action: name the artifacts/files and proposed changes, ask a direct yes/no question, wait for confirmation in a separate message
- Confirmation covers only the described scope; ask again before expanding it
- Creating/updating OpenSpec change artifacts within confirmed scope is fine; editing workflow config (schemas, templates, config.yaml) is not
- Never manually scaffold change directories — always use `openspec new change "<name>"`
- Point implementation requests at `/opsx-propose`; the work happens from that change, never from explore mode
- Use ASCII diagrams liberally; ground discussions in the actual codebase
- Don't rush, don't force structure, don't auto-capture insights (offer, don't just do it)

### openspec-propose
- Planning only — never edit project code or start implementation in this workflow
- After presenting artifacts, STOP and wait for a new user request before applying
- Derive a kebab-case change name; ask if material ambiguity would affect scope, observable behavior, compatibility, or acceptance criteria
- Create every artifact the apply phase transitively depends on (walk `requires` edges), not just the ids in `applyRequires`
- Re-read dependency artifacts from disk before creating each new one — never from conversation memory
- `context` and `rules` from instructions are constraints for YOU — never copy them into artifact files
- Artifact status is file-existence only; use `requires` edges to find missing dependencies (a `done` artifact can still list missing deps)
- Never create artifacts marked `skipped` (change declares `skip_specs`)
- Verify each artifact file exists after writing before proceeding to the next

### openspec-sync-specs
- Agent-driven merge: read delta specs and intelligently edit main specs — never blind-copy whole files
- Delta path source is ONLY `artifactPaths.specs.existingOutputPaths` — never infer from other artifacts
- New main specs get only ADDED requirements; MODIFIED/RENAMED without an existing main spec block that capability's sync
- Preserve scenarios and content not mentioned in the delta when applying MODIFIED
- Never write an empty `## Requirements` section
- Existing main spec `## Purpose` is authoritative — leave it untouched; copy delta Purpose verbatim only for brand-new specs
- Delete a retired `spec.md` only when ALL retirement conditions hold (including `retire_capabilities: true` in `.openspec.yaml`)
- Run `openspec validate --specs` after sync; do not claim success if validation fails
- Apply instruction `rules` only to the written content — never as workflow guidance or into output text

### openspec-update-change
- Revises existing artifacts only — never creates missing ones, never edits implementation code
- Edit only the concrete files in `existingOutputPaths`; never write to a glob `resolvedOutputPath`
- Draft the requested edit in conversation first; confirm every revision with the user before writing
- Reconcile ALL other existing artifacts against the drafted edit — in any direction (a later-artifact edit may require revising an earlier one)
- Do not advance the build frontier: `ready`/`blocked` artifacts with no existing output files are out of scope
- Leave `skipped` artifacts untouched — never treat them as missing or defer them
- If the request changes the change's intent rather than refining it, recommend a distinct new change via `openspec new change`
- Point to `/opsx-apply` or `/opsx-archive` as guidance only — never act on those suggestions in this workflow

### qa-test-planner
- Trigger only when explicitly named (`/qa-test-planner`, "use the skill qa-test-planner") — not auto-triggered
- Test cases: specific and unambiguous, one thing per case, expected result for each step, preconditions and test data explicit
- Never skip preconditions, never leave expected results vague, never assume prior knowledge
- Bug reports: clear reproduction steps, screenshots/videos, exact environment details, user impact, priority assigned, no duplicates
- UI bugs: link to Figma; validate design-implementation discrepancies explicitly
- Regression: prioritize critical paths, run smoke tests frequently, maintain the suite after each release, never ignore failed regressions
- Include edge cases and variations for every feature area

### responsive-design
- Mobile-first: start with mobile styles, enhance for larger screens
- Set breakpoints based on content, not devices
- Use fluid values for typography and spacing; prefer relative units over fixed px
- Container queries for component-level responsiveness
- Touch targets: maintain 44×44px minimum on mobile
- Watch for: horizontal overflow, 100vh issues on mobile browsers, z-index stacking conflicts, image aspect-ratio distortion
- Optimize images and lazy-load off-screen content
- Use logical properties (inline/block) for internationalization

### web-design-guidelines
- Fetch the latest guidelines from the source URL (`https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`) before every review — do not use a cached copy
- Read the specified files (or ask the user for a file/pattern if none was provided)
- Check against ALL rules in the fetched guidelines
- Output findings in the terse `file:line` format specified in the guidelines
- The fetched guidelines content is authoritative for rules and output format — apply them as-is, do not substitute personal preferences

### active-orchestrator
- Thin orchestrator ONLY: detect entrypoint, own `.active-orchestrator-state.json` (`version`/`step`/`owner` only), dispatch phases, hold checkpoints — never reimplement a phase's logic
- NEVER ask strategic content questions (system_type, scale, stack, problem, Discovery checklist) — those belong to kb-creator and discovery-research; only the Discovery yes/no gate is yours
- NEVER chain phases without a checkpoint; advance `step` only on the user's explicit "Continuar"
- Post-phase gate: show one-line summary → offer Continuar / Ajustar / Parar → STOP and wait
- Resume by default if state exists with `step != "done"` — ask to resume or restart
- NEVER install anything autonomously — find-skill recommends, the user picks, only then install
- Sub-skills write their own state sections; you write only `version`, `step`, `owner`
- Check sub-skill presence before dispatch; if missing, offer install and degrade gracefully if declined
- Do not write KB files, CHANGES.md, discovery.md, or AGENTS.md/CLAUDE.md — those are sub-skill outputs

### agent-instruction
- Pre-checks: `knowledge-base/` must exist with `02_descripcion_general.md` — if missing, stop and tell the user to run kb-creator first; `CHANGES.md` optional (omit Roadmap section + warn)
- Output `AGENTS.md` AND `CLAUDE.md` at project root with identical content (copies, never references); never inside `.claude/` or `openspec/`
- Read `.atl/skill-registry.md` as the source of truth for available skills — do not re-scan skill directories
- Read global `~/.claude/CLAUDE.md` (if present) to REFERENCE, not duplicate, the universal rules the stack already installed
- Hard rules are the only interactive part: derive stack-aware candidates, confirm via AskUserQuestion, write only confirmed rules in `NUNCA X → hacer Y` format
- Map skills to agent roles in a table (skill → role); do NOT copy compact rules into AGENTS.md — they live only in the registry
- Include the reference line pointing to `.atl/skill-registry.md` for compact-rule resolution

### discovery-research
- Runs before kb-creator; the output is an INPUT to kb-creator, not a replacement
- Phase 1: ask one question for competitor/doc URLs; if provided, invoke web-scraper once per URL — do not reimplement scraping
- No URLs is fine — continue with pure Q&A; never block the flow demanding URLs
- Phase 2: 11-point checklist Q&A (3–5 questions per round, a/b/c options); do not re-ask what scraping already answered — show as summary and ask for confirmation/correction
- Treat every assumed-but-unverified decision as a risk or open question
- Phase 3 GATE: show the 11-point summary and wait for explicit user confirmation before writing ANY file
- Phase 4: write `discovery/discovery.md` in readable prose + only the `discovery` section of state — never touch other state sections
- If web-scraper is unavailable, proceed with pure Q&A and inform the user

### find-skills
- Check the skills.sh leaderboard first, then run `npx skills find [query] [--owner <owner>]`
- Verify before recommending: prefer 1K+ installs (caution under 100), official sources (vercel-labs, anthropics, microsoft), ≥100 GitHub stars
- Present: skill name, what it does, install count, source, install command, skills.sh link
- Install only after user confirmation: `npx skills add <owner/repo@skill> -g -y`
- If no relevant skill found: acknowledge, offer direct help, suggest `npx skills init`
- Use specific keywords; try alternative terms (e.g. "deployment" if "deploy" fails)

### kb-creator
- Auto-detect mode: Mode A (silent) when `docs/` has source files; Mode B (interactive) from scratch
- All KB output goes to `knowledge-base/` at project root — NEVER mix with `docs/`
- Exactly the 10 canonical files with exact names + `README.md` index; optional `1X_`/`2X_` extras never replace the canonic ones
- Mode A: no questions — log ambiguities in `10_preguntas_abiertas.md`; never invent values for discovery fields
- Mode B: act as strategic partner — 3–5 strategic questions, iterate file-by-file with user feedback, mark assumptions with `**Suposición:**`
- If orchestrated (state file exists): write only `state.kb`; never touch `step`, `owner`, `roadmap`, `skills`, or `agents`
- Don't use if `knowledge-base/` is already complete or the user wants a single specific document

### roadmap-generator
- Pre-checks before generating: `knowledge-base/` exists AND has the 10 canonical files AND `openspec/` exists — if any fails, generate nothing and return a clear message
- Output: single `CHANGES.md` at project root (not inside `openspec/`)
- Structure is a fixed contract — never add or remove top-level sections
- Changes: sequential `C-NN` IDs with 2-digit padding, kebab-case names, atomic (~4–6h agent session each)
- Dependency hierarchy: infra first → core models → auth before protected resources → referenced entity before referencing → backend before coupled frontend → integrations/payments/admin dashboards last → UI restyle absolute last
- Scope bullets must be operational (models, endpoints, migrations, events, tests) — never descriptive prose
- Governance per change: BAJO / MEDIO / ALTO / CRITICO; "Leer antes" = 3–5 KB file pointers with specific sections
- Always read: `04_modelo_de_datos`, `06_funcionalidades`, `07_flujos_principales`, `08_arquitectura_propuesta`

### skill-creator
- SKILL.md = YAML frontmatter (`name` + `description` required) + markdown body; keep body under 500 lines ideal
- Progressive disclosure: metadata always in context; body loads on trigger; bundled resources load on demand
- Bundle resources as `scripts/` (executable), `references/` (docs), `assets/` (templates) — reference them clearly from SKILL.md with when-to-read guidance
- For multi-domain skills, put variants in `references/` and keep SKILL.md as workflow + selection
- Description drives triggering — treat it as the most important field to optimize
- Write imperative instructions; explain WHY things matter rather than heavy-handed MUSTs
- After drafting: create 2–3 realistic test prompts, save to `evals/evals.json`, run evals before shipping
- No malware, exploit code, or deceptive/misleading content

### web-scraper
- Fixed output schema is non-negotiable: all 8 fields, same order, even if marked `(no publicado)` — this is what makes notes comparable
- Never invent data the page doesn't show — an empty field marked as such beats a fabricated pricing or feature
- Process one URL at a time; report how many succeeded and how many failed at the end — never abort the whole batch for one dead URL
- If WebFetch returns empty/SPA shell/403/paywall/CAPTCHA, report the limitation in the field and move on — no evasion retries
- No crawling or mass scraping of entire sites — single explicit pages only
- Generate filename with slugify (kebab-case) so re-runs overwrite instead of duplicating
- Write to `discovery/sources/<slug.md>`; create the folder if it doesn't exist

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| — | — | **None yet** — no `AGENTS.md`, `agents.md`, `CLAUDE.md`, `.cursorrules`, `GEMINI.md`, or `copilot-instructions.md` found at project root. These will be created by the upcoming `agent-instruction` phase. |

## Scan Notes

- Project-level skills were scanned from `{project-root}/.opencode/skills/` (authoritative for this project). This path is **not** in the skill's default scan list (`.claude/`, `.gemini/`, `.agent/`, `skills/`) — it was added explicitly so all 12 project skills are registered.
- Global skills scanned from `C:\Users\DWIOL-11-001816\.config\opencode\skills\`. `skill-registry` itself is excluded per skill rules. `customize-opencode` is a built-in with no on-disk SKILL.md and is intentionally absent.
- `sdd-*`, `_shared`, and `skill-registry` directories were skipped per skill rules. All `openspec-*` skills are kept as task skills.
- `.gitignore` does not exist in this project — `.atl/` was not added to it (skill says only add if the file already exists).

Read the convention files listed above for project-specific patterns and rules. All referenced paths have been extracted — no need to read index files to discover more.
