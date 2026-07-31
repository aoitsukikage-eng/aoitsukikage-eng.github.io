---
title: Discord Multi-Bot Showcase
slug: discord-bot-showcase
summary: Installable Python application layer for three data-driven Discord personas sharing a bounded request queue, namespaced memory, and a common AI provider interface.
track: personal_project
domain:
  - discord
  - python
  - bots
  - concurrency
status: completed
visibility: public
featured: false
order: 2
teamRole: Solo builder
background: Built to learn bounded-concurrency and failure-handling patterns for a Discord application with multiple AI persona bots running in the same guild.
disclosure: Source code is published at the linked repository. Credentials, the private multi-key Engine pool and key-rotation logic, and production service configuration are excluded from the public release. Users may configure their own supported provider key (mock or single-key Gemini).
links:
  repo: https://github.com/aoitsukikage-eng/discordbot-showcase-public
---

## Overview

A personal project that runs three Discord bots with distinct AI persona profiles in one guild. All three personas share the same installable Python package — only the persona profile (system prompt, dialogue lines, fortune templates) differs between instances.

## Architecture

Incoming slash commands and @mention events are handled by deferring the Discord interaction immediately, then routing the request through a bounded `asyncio.Queue` with a small worker pool. Concurrency is controlled at the worker layer rather than at the Discord event handler, giving explicit backpressure: a full queue returns a clear "system busy" message instead of dropping requests or spiking concurrency into the provider's rate limit. Each AI call has independent timeouts at the enqueue step, the result-wait step, and any optional external lookup.

## Commands

Seven slash commands plus one @mention interaction entry point are registered per persona instance:

| Command | Description |
|---|---|
| `@bot <message>` | Mention-triggered chat (attachment context supported) |
| `/ask <prompt>` | AI chat with per-user namespaced memory |
| `/fortune <sign>` | Deterministic daily horoscope (SHA-256 seeded) |
| `/roulette_kick` | Opt-in community kick interaction |
| `/memory_reset` | Clear your /ask memory in this channel |
| `/memory_status` | Inspect your current memory turn count |
| `/perm_check` | Show bot permission and intent status |
| `/debug_context` | Inspect the assembled AI prompt context |

`/roulette_kick` is disabled by default and requires `ROULETTE_KICK_ENABLED=true` at startup. Guild owner, all bots, and members whose top role is at or above the bot role are never selectable targets regardless of configuration.

## Namespaced Memory

Conversation memory is keyed by `{bot_namespace}:{guild_id}:{channel_id}:{user_id}`. This prevents cross-bot memory contamination when multiple persona instances share a guild. Memory is in-process RAM only — it resets on process restart and is bounded to a configurable turn limit.

## Provider Boundary

The package ships three AI provider adapters:

- **MockProvider** — no network calls; echoes prompt prefix. Used in all tests.
- **GeminiProvider** — single-key Gemini adapter via the google-genai SDK.
- **ExternalProvider** — stub for wiring a custom backend via the published adapter contract.

The private multi-key Engine pool and key-rotation logic used in the personal deployment are **not included** in this repository. Credentials, bot tokens, and production service configuration are excluded. Users may configure their own supported provider key.

## Testing

102 tests pass with no network calls, verified by the accepted CI run on Python 3.11 and 3.12. Coverage spans command handlers, queue worker behavior, persona profile loading, fortune determinism, roulette candidate selection policy, provider adapters, memory namespacing, and interaction helper utilities.

## Scope Note

This is a personal hobby project. No live hosted service, user count, uptime figure, traffic metric, or production deployment is claimed.
