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

## 2026-08-02 — Portfolio optimisation research brief: narrative rewrite and reveal-animation fix

The `portfolio-optimization-sharpe-ratio` research page was rewritten after
direct review against the original course deliverables
(`investment-report.docx`, `investment-analysis.xlsx`), across four commits
on `research/portfolio-narrative-rewrite`.

The public brief had dropped the source report's full decision chain: the
retirement-savings goal (40-year, NT$15M target) that produced the 4.93%
required annual return, the fund-selection rationale (similar Sharpe ratios,
low correlation, to avoid the optimiser collapsing to a corner solution), and
the final two-fund-separation allocation (86.98% risk asset / 13.02%
risk-free) that ties the analysis back to the 4.93% target. All three were
restored from the source documents; `document/quant-research-source-map.md`
already listed the retirement-target context as approved for publication, it
had simply never been written into the page. A plain-language pass then
rewrote the summary, highlights, and body prose for a general-audience reader,
adding a term glossary on first use of finance jargon (GMV, Max Sharpe,
efficient frontier, CML, two-fund separation) and plain-language readouts
after each data table.

Two defects were found and fixed during live review of the rendered page:

- A markdown typo (two single tildes used as range separators in the same
  sentence — `4.9%~6.6%` and `4~5萬元`) was being parsed as GFM strikethrough,
  silently deleting the text between them.
- The page's scroll-reveal `IntersectionObserver` requires 18% of a
  `[data-reveal]` element's own height to enter the viewport before it fades
  in. The rewritten source-brief section became 3751px tall against an 813px
  viewport, so a reader could scroll to the very bottom of the page and still
  never have 18% of it in view at once — the section stayed permanently
  invisible (`opacity: 0`), independent of scroll speed or path. Fixed by
  dropping `data-reveal` from that section in the shared `[slug].astro`
  template, since it is reference content rather than a hero reveal moment.
  Root cause was confirmed via direct CDP measurement
  (`getBoundingClientRect`, `classList`) rather than visual inspection alone,
  since the failure mode is scroll-path-dependent and did not reproduce in
  every screenshot method tried.

The efficient-frontier chart was also moved out of the standalone Visual
Model section and embedded beside its coordinate table inside the "Efficient
Frontier and Capital Market Line" section (new `.frontier-figure` two-column
layout, single column below 760px), since that section already explains the
chart and a separate caption was redundant. The shared template gained a
guard so the Visual Model section is skipped only for quantitative items with
no `visuals` entries; the other 4 research pages were spot-checked and are
unaffected.

All commits were verified with `npm run build` (all 16 pages) and a fresh
`astro preview` render, which was necessary to rule out dev-server HMR
staleness — the two-column chart layout briefly appeared broken only because
the long-running `astro dev` process had accumulated a stale scoped-style
hash after many hot-reloads in one session; restarting the dev server
resolved it and matched the production build. Worktree:
`task-20260731-portfolio-research-sharpe-narrative`.
