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

## 2026-08-01 — Trip Weather Planner project page publication

Commits `47c3888` (feat: add Trip Weather Planner project entry), `99a997f`
(feat: add per-project disclosure toggle and hero repo button), and `0a827ea`
(feat: embed Trip Weather Planner screenshots inline with feature copy) were
merged via PR #3 to main as `cdb94e3`. GitHub Pages workflow run
`30709894321` completed successfully
(https://github.com/aoitsukikage-eng/aoitsukikage-eng.github.io/actions/runs/30709894321).

Live verification of `https://aoitsukikage-eng.github.io/projects/` and
`https://aoitsukikage-eng.github.io/projects/trip-weather-planner/` confirmed:
the Projects collection now has six entries; the Trip Weather Planner card
and detail page are visible; the repository link resolves; and all three
screenshot assets return HTTP 200.

The published case page is written in plain, non-engineer-facing language
(What it does / Built with / About the demo / Scope Note) rather than an
implementation-level writeup. It reuses the `showDisclosureLayer` flag and
hero "View Source on GitHub" button pattern first prototyped on the
unmerged `task/20260731-portfolio-discordbot-copy-rewrite` branch — applied
here independently, on this project's own branch, without pulling in that
branch's Discord Bot content changes. The Public-safe disclosure layer
section is hidden for this entry via that flag.

Three screenshots from the current in-development build are embedded inline,
each directly under the paragraph it illustrates: town search with the
7-day forecast and a plain-language trip note; the 72-hour hourly chart; and
the sunrise/sunset, UV, air quality, and moon-phase feature cards. The page
text explicitly notes these are from the in-development build, not the
linked public demo, since the Phase 2 enrichments visible in them (moon
phase, UV, AQI) predate that demo's Azure v1.0.0 Phase 1 build.

Public/private boundary and version disclosure: this entry covers the
v1.1.0 Phase 2 Git release plus post-release Asia/Taipei date and cache
fixes that have acceptance evidence but are not merged, pushed, or
deployed. The linked public demo remains the earlier Azure v1.0.0 Phase 1
build. This publication covers only the engineering case page; the
screenshot-first homepage feature and the future `/labs/trip-weather/`
interactive mini route described in the 2026-07-31 flagship-preparation
entry above remain not implemented.

A non-blocking Node.js 20 deprecation annotation was logged during the
workflow run, matching prior publication runs; affected actions were forced
to Node.js 24 and the workflow completed successfully.

The project originated from an internship take-home prompt and was
independently extended. This record does not imply employer endorsement.

## 2026-08-02 — Discord Multi-Bot Showcase: content rewrite for a general audience

The `discord-bot-showcase` case page was rewritten after direct review of the
rendered page against its intended readers: recruiters, academic reviewers,
and prospective collaborators, rather than engineers evaluating the source
directly (they were assessed as more likely to read the linked GitHub
repository than the case page prose).

The prior copy led with implementation vocabulary in the summary and
Architecture section (`asyncio.Queue`, worker-pool backpressure, namespaced
memory keys) with no plain-language framing of what the project does or why
it exists. It was rewritten around what the three bots actually do (memory,
reading images/PDFs/YouTube links, daily fortunes, an opt-in kick-roulette
game) and how the project grew from a single-turn, no-memory prototype to its
current feature set, with implementation detail condensed into one short
"How It's Built" section instead of a full architecture/command/module
reference.

The page's "Public-safe disclosure layer" section (Team Role / Background /
Disclosure Scope) was disabled for this entry via the `showDisclosureLayer`
flag added to the shared project template on `main` during the concurrent
Trip Weather Planner work — for a fully public, no-NDA hobby project the
section carried no information beyond what the rewritten Overview already
states, and its formal register sat awkwardly ahead of the page's new
plain-language opening. Confidential and partial-visibility entries are
unaffected; the flag is opt-in per project.

Three real screenshots from the author's own Discord server were added,
embedded directly beneath the specific feature bullets they demonstrate
(media understanding via a YouTube-link reply, a `/fortune` result, and a
`/roulette_kick` round) rather than in a separate gallery section — an
earlier static-grid gallery layout was built, previewed, and rejected in
favor of this in-context placement. Five other candidate screenshots were
reviewed and left unused to keep the page scannable.

Because independent work on the Trip Weather Planner entry had already
modified the same shared template and schema files (`[slug].astro`,
`content.config.ts`) to add the same disclosure-toggle and hero repo-link
behavior, the original working branch was superseded rather than merged
as-is: its content changes were reapplied on top of the post-merge `main`
(commit `cdb94e3`) on a fresh branch, verified there was no duplication or
conflict, and merged clean (`d2953aa`). All work was verified with
`npm run build` (17 pages) both before and after the merge. This merge is
local to `main` on the Ubuntu working copy; it has not been pushed to
`origin` or deployed, so nothing in this entry is a live-site claim.
Worktrees: `task-20260731-portfolio-discordbot-copy-rewrite` (superseded),
`task-20260802-portfolio-discordbot-copy-final`.

## 2026-08-07 — Activities log: first two real entries publication

Two of the four placeholder activity entries were replaced with real,
public-cleared content: an AI workshop volunteering shift with GDG on
Campus NTPU at Dacheng Elementary School (2026-06-24), and a campus visit
to IBM Taiwan paired with an IBM SkillsBuild platform introduction
(2026-07-14). The remaining two placeholder entries (semester demo talk,
sustainability forum) were removed rather than left alongside the real
ones, so the page's entry count reflects actual activity history rather
than a mix of real and placeholder records. Role Summary and Learning
Capture copy was reused near-verbatim from the author's own LinkedIn posts
for both entries, split across the two fields along their natural
scene-setting / reflection break.

The `activities.photos` schema only supported placeholder caption strings
before this entry; there was no way to render an actual photo. It was
extended to a union of the legacy string form and a new
`{ src, alt, caption }` object form, and `activities.astro` was updated to
render a real `<img>` for object-typed photos while keeping the existing
placeholder-frame rendering for any future string-typed entries, so no
prior content needed migration. Six photos (three per entry) were sourced
from the author's own event photos; two oversized IBM slide photos
(~2MB, 4032x2268 phone originals) were downscaled to ~400KB before adding
to `public/activities/`, matching the size range of other published site
assets.

Photo selection went through an explicit privacy pass with the site owner
before publication: one candidate photo (the Dacheng closing group shot)
clearly shows the faces of a dozen-plus elementary school students, and
was confirmed by the owner as pre-cleared with the school/foundation for
public use before being included as-is. Photo captions were also iterated
against the owner's confirmation of who actually appears in each frame,
since several show multiple people and the intent was for captions to
accurately reflect the author's own participation (e.g. "Guiding a
student one-on-one...", "Asking a question during the Q&A...") rather than
describe bystanders.

Two defects were found and fixed during live-preview review of the new
content, both pre-existing bug classes already documented elsewhere in
this log rather than novel to this change:

- The `#activities-log` section wrapped all activity entries under a
  single `data-reveal` scroll-reveal target. With three-photo entries
  now much taller than the old two-slot placeholder cards, the section
  became too tall to ever satisfy the sitewide IntersectionObserver's
  18%-visibility threshold, leaving the entire activity list invisible
  at `opacity: 0` regardless of scroll position — the same failure mode
  previously fixed on the Sharpe-ratio research page. Fixed by moving
  `data-reveal` from the wrapping section down to each `<article>` card
  individually, so each card reveals independently at a height the
  observer can actually satisfy.
- `.activity-entry__body`'s two-column grid (text column | photo column)
  defaulted to `align-items: stretch`, so once the photo column grew tall
  enough to hold three real images, the text column was stretched to
  match and distributed the extra height across its own internal rows —
  including the tag-chip row, whose flex children then stretched
  vertically into elongated pill shapes instead of staying compact. Fixed
  with `align-items: start` on the two-column grid so each column sizes
  to its own content.

All changes were verified with `npm run astro -- check` (0 errors,
0 warnings) and `npm run build` (17 pages) after each edit, and visually
confirmed against a live `astro preview` served over the Tailscale network
so the site owner could review the rendered page and photo captions
directly before merge. Branch: `task/20260803-portfolio-activities-real-content`.
