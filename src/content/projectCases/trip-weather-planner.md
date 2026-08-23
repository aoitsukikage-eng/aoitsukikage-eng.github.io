---
title: Trip Weather Planner
slug: trip-weather-planner
summary: A travel-weather planner for Taiwan — pick a town and a date to see the week's forecast, the next few days hour-by-hour, sunrise/moonrise, UV, air quality, and weather warnings all in one place.
lang: en
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

Trip Weather Planner helps with the "what should I pack and when should I go" part of planning a trip in Taiwan.

Pick a town and a date, and see the week's forecast alongside a plain-language trip note for that day, plus any active weather warnings for the area. (Screenshots below are from the in-development build described above, not the older public demo.)

![Town search form with a 7-day forecast strip and a plain-language trip note for the selected day](/projects/trip-weather-planner-week-forecast.png)

Planning around the next few days specifically? A 72-hour, hour-by-hour view shows temperature, feels-like temperature, and rain chance in 3-hour steps.

![Line chart of temperature and feels-like temperature over the next 72 hours in 3-hour steps, with rain chance bars underneath](/projects/trip-weather-planner-72h-forecast.png)

A row of quick-glance cards rounds it out with sunrise/sunset, current UV, current air quality, and moon phase for the same town and date.

![Four feature cards showing sunrise and sunset, current UV index, current air quality, and moon phase for the selected town and date](/projects/trip-weather-planner-feature-cards.png)

You can also save a handful of favorite towns so the places you check often are one tap away.

## Built with

A React interface backed by a Python (FastAPI) service that pulls together data from Taiwan's Central Weather Administration and Ministry of Environment into one consistent view, hosted on Azure.

## About the demo

The demo linked below is an earlier version. Development is ongoing, and a newer version — with better handling of day changes and fresher data — has already been built and tested, and will go live in a future update.

## Scope Note

This project started as an internship take-home assignment and has been extended independently since; it isn't an employer's product, and no traffic or usage numbers are claimed for the demo.
