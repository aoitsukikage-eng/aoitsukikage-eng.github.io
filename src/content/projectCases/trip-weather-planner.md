---
title: Trip Weather Planner
slug: trip-weather-planner
summary: A travel-weather planner for Taiwan — pick a town and a date to see the week's forecast, the next few days hour-by-hour, sunrise/moonrise, UV, air quality, and weather warnings all in one place.
track: personal_project
domain:
  - weather
  - react
  - python
  - azure
status: active
visibility: public
featured: true
order: 1
teamRole: Solo builder.
background: Started as an internship take-home assignment, then continued afterward as an independent side project with ongoing updates.
disclosure: The public demo below is running an earlier version of the project. A newer version has already been built and tested, and will replace the demo build in a future release.
showDisclosureLayer: false
links:
  repo: https://github.com/aoitsukikage-eng/trip-weather-planner
  demo: https://twpfe5ce0.z23.web.core.windows.net/
---

## What it does

Trip Weather Planner helps with the "what should I pack and when should I go" part of planning a trip in Taiwan. Pick a town and a date, and it brings together in one page:

- The week's forecast and an hour-by-hour view for the next few days
- Sunrise/sunset and moonrise/moonset with moon phase
- UV level and air quality, both current and forecast
- Active weather warnings for that area
- A plain-language summary of what to expect

You can also save a handful of favorite towns so the places you check often are one tap away.

## Built with

A React interface backed by a Python (FastAPI) service that pulls together data from Taiwan's Central Weather Administration and Ministry of Environment into one consistent view, hosted on Azure.

## About the demo

The demo linked below is an earlier version. Development is ongoing, and a newer version — with better handling of day changes and fresher data — has already been built and tested, and will go live in a future update.

## Scope Note

This project started as an internship take-home assignment and has been extended independently since; it isn't an employer's product, and no traffic or usage numbers are claimed for the demo.
