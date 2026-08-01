# Developer log

## Feature logs

- [About and Contact](./about_contact_developer_log.md) — Design and verified implementation status for the combined About and Contact experience.

## 2026-07-31 — Discord Multi-Bot Showcase publication

Commits `3fcd929` (feat: add Discord Bot Showcase project entry) and `dd127a0`
(fix: correct Discord portfolio wording per management pre-review) were
independently accepted by the acceptance layer. PR #1 was merged to main as
`2586b007870317770550287f9d357cbdc034f9fb`. GitHub Pages workflow run
`30635875268` completed successfully.

Live verification of `https://aoitsukikage-eng.github.io/projects/` and
`https://aoitsukikage-eng.github.io/projects/discord-bot-showcase/` confirmed:
the Projects collection remains five entries; Personal Tooling Lab was removed;
the Discord Multi-Bot Showcase card and detail page are visible; the public
repository link resolves correctly; and no fake demo link is present.

The published project demonstrates a shared installable core that drives three
data-driven bot personas. Core concurrency design uses a bounded asyncio.Queue
with worker-pool backpressure and per-step independent timeouts. Conversation
state is isolated by namespaced memory keyed as
`bot_namespace:guild_id:channel_id:user_id`. Each persona instance registers
seven slash commands plus one @mention interaction entry point. The opt-in
`/roulette_kick` command applies safeguards that exclude the guild owner, all
bots, and members whose top role is at or above the bot role. A provider
boundary separates MockProvider, GeminiProvider, and ExternalProvider stub,
allowing user-supplied keys without exposing private engine internals. The
release is backed by 102 accepted tests across Python 3.11 and 3.12 CI.

Public/private boundary: credentials, private multi-key Engine pool,
key-rotation logic, bot tokens, and production service configuration are
excluded from the public repository. No live hosted bot, uptime, user count,
traffic, or production deployment claims are made.

Two non-blocking follow-ups were observed but did not block the successful
publication and deployment verification:

- **Non-blocking:** A browser console SyntaxError for a duplicate
  `prefersReducedMotion` declaration was observed on the `/projects/` page.
  This is a pre-existing issue unrelated to the Discord Showcase addition.
  The Discord content rendered and live URL checks passed; the effect on
  filters or other interactions was not assessed in this publication
  verification.
- **Non-blocking:** GitHub Actions logged a Node.js 20 deprecation annotation
  during the workflow run. Affected actions were forced to Node.js 24 and the
  workflow completed successfully.

## 2026-07-31 — Trip Weather Planner flagship integration preparation

Trip Weather Planner is being prepared as the portfolio's first flagship
build. The portfolio will present it through a screenshot-first homepage
feature, an engineering case at `/projects/trip-weather-planner/`, and a
future interactive mini route at `/labs/trip-weather/`. The homepage will not
embed an iframe or live bundle. A top-level Labs navigation item remains
deferred until there are multiple stable interactive projects.

Portfolio management has completed the master plan, public-claims and copy
deck, mini-artifact contract, and staged task sequence. These are planning
artifacts: they do not constitute a portfolio implementation or release.

Independent verification of the TWP mini found the approved
`feature/portfolio-mini` HEAD at `0d1bbee`. The shared product source was
implemented before the final coverage commit. The mini test suite passed
3 files and 15 tests; backend tests passed 48 tests; and the full frontend
suite passed 8 files and 110 tests. Both mini and full frontend production
builds passed. Verified screenshots exist at 1440x1000 and 390x844. The final
coverage remediation was approved on 2026-07-31.

This evidence is not a release claim. The mini branch is not merged, pushed,
or deployed. Portfolio homepage, case-study, and mini-route integration have
not been implemented. Portfolio main remains at `34ff7a9` at this log entry.
The public Azure demo remains an earlier version, and the Portfolio CORS and
runtime backend changes are not active.

The next gates are to receive and freeze case facts and the artifact manifest;
implement and accept the homepage and case page; validate and ingest the
unchanged mini artifact; then complete independent acceptance before any
merge, push, or deployment decision.

The project originated from an internship take-home prompt and was
independently extended. This record does not imply employer endorsement.
