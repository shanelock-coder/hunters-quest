# Hunter’s Quest

A sunny, offline-friendly Croatian, Cyrillic and maths learning adventure.

Live app: https://shanelock-coder.github.io/hunters-quest/

## Start

Open the app online once and wait for **Ready for offline adventures**. A grown-up creates a private 6–12 digit PIN on the device. Use Safari’s Add to Home Screen or your Android browser’s Install option to keep it handy.

## Learning

- 243 Croatian cards and phrases across Minecraft, Roblox, PS5, Harry Potter, gaming and music/Marshmello interests, including Hunter sentences.
- Two-way translation, memory pairs, flashcard study/checks, sentence building, typing, maths and script matching.
- Latin/Cyrillic alphabet tracing and gentle hints. Croatian normally uses Latin; Cyrillic is an additional reading bridge using Serbian Cyrillic correspondences.
- Eight maths topics: place value, sums, multiplication/division, fractions, money, time, measurement and shapes. Three parent-selected levels.
- Separate script and recognition/recall learning records, with weak-item revision.

## Weekly reward

Five qualifying, parent-approved days in a Monday–Sunday week earn one $10 AUD reward. Each day requires all of:

- 15 minutes of focused active practice; time stops after 30 seconds without meaningful input.
- Three games with at least five distinct scored items each.
- 10 English→Croatian and 10 Croatian→English answers, with five first-attempt unhinted answers in each direction.
- 10 maths answers across at least two topics.

Repeated items across scripts cannot inflate the reward. Reveals and flashcard flips alone do not score. Two days can be rest days. After five approved days, further play is optional. A partial first week is a warm-up if fewer than five days remain.

The chart starts a new week each Monday while keeping past results, learning records, approvals and earned/paid rewards. Parents review the evidence and manually record payment; the app never transfers money.

## Keeping progress safe

Progress lives in this browser’s local storage, not on GitHub. Export backups from the parent area before clearing browser data or changing devices. Keep the parent PIN privately; there is no universal recovery PIN. Normal imports preserve this device’s PIN. Recovery from unreadable data requires the backup’s PIN.

The offline PIN is a household gate, not tamper-proof security. Someone with technical device access can alter local records or time. Backward clock changes pause time credit until the clock is restored. Review evidence before paying. Optional pronunciation depends on a Croatian voice installed on the device.

## Development

Requires Node.js 22+ for tests/preview; no npm install or build step.

```sh
npm test
node serve.cjs
```

Preview: http://127.0.0.1:4174/hunters-quest/

GitHub Pages serves `main` at `/`. Increment the cache version in `sw.js` whenever releasing asset changes. The app offers available updates under About & help.

This independent family app has original artwork and learning sentences. Referenced entertainment brands belong to their owners and do not endorse it. No ads, accounts, chat or analytics.
