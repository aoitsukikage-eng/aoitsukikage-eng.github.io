---
title: Discord Multi-Bot Showcase
slug: discord-bot-showcase
summary: Three Gemini-powered Discord chatbots, each with its own personality, living together in one server — they remember conversations, understand images and YouTube links, tell daily horoscopes, and even run a playful kick-roulette mini-game.
lang: en
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
background: Started as a fun way to bring an AI chat companion into a Discord server with friends, and grew into an ongoing project for learning how to build and run a real, always-on AI application.
disclosure: Source code is published at the linked repository. Credentials, the private multi-key Engine pool and key-rotation logic, and production service configuration are excluded from the public release. Users may configure their own supported provider key (mock or single-key Gemini).
showDisclosureLayer: false
links:
  repo: https://github.com/aoitsukikage-eng/discordbot-showcase-public
---

## Overview

Three Discord bots — 北大肥宅哥布林長老, 北大哥布林館長, and 萊爾校長 — live together in the same server, each with its own personality, all powered by Google's Gemini. Ask one a question, @mention it in chat, or drop in a photo, a document, or a YouTube link, and it responds in character. Under the hood, all three run on the exact same codebase; only the personality changes from one to the next. The system is built to keep growing — new commands and new personas can be added without touching the core.

## What They Can Do

- **Remember you** — `/ask` keeps a running memory of its conversation with each person, so you don't have to repeat yourself every message.
- **Follow the room** — beyond direct replies, the bots read recent channel messages to stay aware of what's actually being talked about, not just the last thing typed at them.
- **Understand more than text** — share a photo, a PDF, or a YouTube link with an @mention, and the bot can look at (or watch) it and talk about it.

![The bot replying with commentary after being sent a YouTube link.](/projects/discord-bot-showcase/youtube-read.png)

- **Tell your fortune** — `/fortune` gives a deterministic daily horoscope per zodiac sign: same sign, same day, same answer for everyone who asks.

![The bot's daily horoscope reply for the chosen zodiac sign.](/projects/discord-bot-showcase/fortune-result.png)

- **Run a kick-roulette game** — `/roulette_kick` is an opt-in party game where the bot randomly "votes" to kick someone from the server, with built-in guardrails so the server owner, other bots, and higher-ranked members can never be picked.

![The bot running the opt-in kick-roulette game and announcing a result.](/projects/discord-bot-showcase/roulette-kick.png)

- **A few backstage tools** — `/memory_reset`, `/memory_status`, and `/perm_check` let you check or clear the bot's memory and permissions, mostly useful for debugging rather than everyday chatting.

## How It's Built (the short version)

All three personas share one installable Python package — the only thing that changes between them is a personality profile (tone, catchphrases, response templates). Requests are handled through a small internal queue with its own worker pool, so if a lot of people ask questions at once, the bot queues them up and answers each one in turn instead of freezing or crashing. Each bot also talks to its AI provider through a swappable interface, so the same codebase can run against a mock provider for testing, a single Gemini key for anyone trying the public version, or a private production setup, without changing any application code.

## How It Grew

The project didn't start out this way. The very first version could only handle one question and forget it the moment it answered — no memory, no personality, just a bare AI reply. From there it grew step by step: memory came first, so conversations could carry across multiple messages; then came the ability to understand images and YouTube links, so the bots could react to more than plain text; then came the more playful features — daily horoscopes, and eventually the kick-roulette mini-game — once the core was stable enough to support features that existed purely for fun. What's now three distinct, always-on personalities started as an experiment to see if a Discord bot could feel like more than a command-response script.

## Scope Note

This is a personal hobby project, built and run for fun in a private Discord server. No live hosted service, user count, uptime figure, traffic metric, or production deployment is claimed.
