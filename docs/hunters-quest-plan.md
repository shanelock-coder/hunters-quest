# Hunter's Quest Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Publish a separate offline Croatian, Cyrillic, and maths learning app for Hunter with meaningful daily quests and parent-verified $10 weekly rewards.

**Architecture:** A static, dependency-free app with isolated pure modules for learning, evidence, calendar, and reward calculation. Browser modules persist validated records, manage parent authentication, and render games and charts. The PIN is a household verification tool; offline storage and device time are not tamper-proof.

**Tech Stack:** HTML, CSS, JavaScript ES modules, Web Crypto, localStorage, service worker, Node's built-in test runner, GitHub Pages.

**Spec:** [Approved design](./bok-junior-design.md), including the Cyrillic addition.

## Global constraints

- Separate public repository/site, provisionally `shanelock-coder/hunters-quest`; never overwrite the existing Bok app. Publish source only, never personal progress, PIN data, or backups.
- 5 qualifying, parent-approved days in a Monday–Sunday week earn one $10 reward. The other 2 days are rest/optional practice days.
- Each qualifying day requires 900 active seconds, 3 game types with at least 5 qualifying items each, 10 English-to-Croatian items, 10 Croatian-to-English items, and 10 maths problems.
- At least 5 items in each translation direction must be answered correctly on the first attempt without a hint. This defines the design's independent-answer requirement.
- Same-item duplicates across scripts, full-answer reveals, self-rated flashcard flips, and idle/background time cannot inflate reward evidence. A revealed item becomes eligible only in a later scored recall encounter, not by copying its displayed answer.
- At least 240 authored Croatian items; include Hunter, Minecraft, Roblox, PS5, Harry Potter, gaming, and music/Marshmello contexts. Use original artwork and original sentences.
- Latin/Cyrillic learning stays separate; week changes reset only the quest chart, not mastery or historical evidence.
- Default timezone Australia/Brisbane. Freeze reward rules and timezone for each started week so later settings cannot silently reinterpret old records.
- Save after answers; show save failures and stale-tab conflicts. Backups are validated before replacing data.

## Review focus

1. A session crossing midnight or Monday credits each response to its actual day, rather than awarding all work to its starting day.
2. Refreshing, switching scripts, and revisiting easy questions must not bypass quest requirements.
3. A returning family must see archived weeks and unpaid rewards after a long offline gap.
4. PIN failures, malformed imports, and unavailable storage must not wipe existing records or approve rewards.
5. Valid Cyrillic answers, equivalent fractions, and money notation must be accepted without accidentally accepting a wrong script, unit, or value.

## Files and interfaces

Build in `work/hunters-quest/`. Keep final downloadable deliverables in `outputs/`.

- `content.js`: `WORLDS`, `CARDS` with `{id, world, en, hr, alternatives, clue, explanation}`; 240+ authored items.
- `scripts.js`: `toCyrillic(text)`, `toLatin(text)`, `displayText(card, script)`, `alphabet`; explicit proper-name handling.
- `maths.js`: `makeProblem(topic, level, seed)` returning `{id, topic, prompt, answer, unit, hint, steps, visual}`; `checkMathAnswer(problem, input)`.
- `calendar.js`: `dayKey(timestamp, timezone)`, `weekKey(day)`, `weekDays(week)`; operate on calendar dates without host-timezone arithmetic.
- `progress.js`: `freshState()`, `recordEvidence(state, event)`, `dailyStatus(state, day)`, `weeklyStatus(state, week)`, `approveDay(state, day, timestamp)`, `markPaid(state, week, timestamp)`.
- `learning.js`: `selectItems(cards, records, options)`, `checkTranslation(card, input, direction, script)`, `updateMastery(records, result)`; novelty, spaced review, and direction/script-specific mastery.
- `storage.js`: `loadState()`, `saveState(state, expectedRevision)`, `validateState(input)`, backup/import; app-specific keys and revision checks.
- `parent.js`: `createPin(pin)`, `verifyPin(pin, verifier)`; salted PBKDF2 verifier, bounded parent session, failed-attempt lockout.
- `activity.js`: focused, visible active-practice timer using monotonic time; meaningful input renews activity, inactivity caps credit, clock anomalies are flagged.
- `games.js`, `views.js`, `app.js`: state-driven games, chart, parent controls, navigation, and save flow.
- `tracing.js`: adapt the existing tested uppercase tracing geometry and scoring for the standalone alphabet studio.
- `index.html`, `styles.css`, `manifest.webmanifest`, icons, `sw.js`, `.nojekyll`: accessible responsive offline shell.
- `tests/*.test.js`: module-level behaviour tests; document browser verification in `docs/verification.md`.

## Task 1 — Durable calendar and reward evidence

**Files:** `calendar.js`, `progress.js`, `storage.js`, `package.json`, `tests/progress.test.js`, `tests/storage.test.js`.

**Evidence:** Every event has a unique id, timestamp, day, game, subject, item id, direction, script, correctness, hint/reveal status, and first-attempt flag. Store daily active seconds separately. Deduplicate rewards by subject, canonical item, and direction, excluding script; record learning attempts even when reward credit is duplicate. A game's five-item threshold also requires distinct earned items.

- [ ] Write failing tests for 4 versus 5 approved days; 899 versus 900 seconds; 2 versus 3 game types; missing maths or one language direction; hint/reveal credit; and script-switch duplicates. Assert `weeklyStatus(...).earned === false` until all five days qualify and are approved.
- [ ] Add calendar tests spanning Sunday/Monday, midnight, month/year boundaries, timezone changes, and late approval of an archived week. Assert old rewards and mastery remain unchanged.
- [ ] Run `node --test --test-isolation=none tests/progress.test.js tests/storage.test.js`; confirm failures identify missing behaviour.
- [ ] Implement the interfaces above. Preserve all weekly records and derive eligibility from evidence; a paid reward requires an earned week and cannot be paid twice. Detect stale revisions and reject invalid or dangerous backup structures before modification.
- [ ] Run the same command; require all tests passing. Commit this independently testable evidence layer.

## Task 2 — Croatian curriculum and Cyrillic learning

**Files:** `content.js`, `scripts.js`, `learning.js`, `tracing.js`, `tests/learning.test.js`, `tests/content.test.js`.

- [ ] Write failing tests for unique content ids, at least 240 items, all six worlds, meaningful clues/explanations, both answer directions, valid alternatives, fresh rounds, and weak-item resurfacing.
- [ ] Assert `toCyrillic('Hunter voli glazbu.') === 'Хантер воли глазбу.'`; test љ/њ/џ and exceptions, unchanged brand names, separate script records, and rejection of Latin answers where Cyrillic is explicitly required. Test every trace glyph and rejection of taps/scribbles.
- [ ] Run the learning/content tests and observe expected failures.
- [ ] Author the curriculum and implement the interfaces. Use basic nouns, verbs, useful sentences, and Hunter's interests; visually separate pronunciation/script support from an answer reveal. Deduplicate equivalent answer options.
- [ ] Run the tests; require all passing. Commit the curriculum and learning engine.

## Task 3 — Maths with meaningful variation

**Files:** `maths.js`, `tests/maths.test.js`.

- [ ] Write failing tests for all eight topic groups: number/place value, addition/subtraction, multiplication/division, fractions, decimals/money, time, measurement, and shapes/perimeter. Include multi-step stories across these groups.
- [ ] Test equivalent fractions, exact cents, explicit units, valid dimensions, division constraints, seeded reproducibility, varied numbers, and canonical ids that prevent reversal/duplicate farming.
- [ ] Run `node --test --test-isolation=none tests/maths.test.js`; confirm failures.
- [ ] Implement deterministic templates with intro/steady/stretch levels, English instructions, optional Croatian vocabulary, hints, and worked solutions. Track topic mastery; daily maths mixes at least two topics instead of letting the easiest topic fill the whole requirement.
- [ ] Run the tests across a large fixed seed set; require correct answers and valid domains for every generated problem. Commit the maths engine.

## Task 4 — Parent gate and active-time accounting

**Files:** `parent.js`, `activity.js`, `tests/parent.test.js`, `tests/activity.test.js`.

- [ ] Write failing tests for salted PIN creation/verification, wrong PINs, repeated failures, session expiry, and no universal bypass. Parent setup accepts 6–12 digits; lock verification for 60 seconds after 5 consecutive failed attempts.
- [ ] Test that active seconds stop when hidden, unfocused, outside a game, or inactive for over 30 seconds; reload cannot replay credited time. Test resumed sessions and backward-clock flags. Pointer movement alone does not renew activity.
- [ ] Run the tests and confirm failures, then implement the interfaces using Web Crypto and monotonic elapsed time. Parent sessions expire after 5 minutes without parent activity and are not saved as an unlocked flag.
- [ ] Run the tests; require all passing. Commit parent protection and active-time handling.

## Task 5 — Playable app and full weekly chart

**Files:** `games.js`, `views.js`, `app.js`, `index.html`, `styles.css`, icons, integration tests.

- [ ] Test the session transitions first: unanswered → hinted/answered → feedback → next → saved results. Test that a flashcard reveal alone never emits scored evidence and a repeated submit emits only one event.
- [ ] Implement a bright responsive adventure UI with Today, Games, Worlds, Alphabet, Progress, and Parent areas. The child sees clear remaining requirements, encouraging corrections, and rest-day status after five approved days.
- [ ] Implement two-way translation, face-down memory, flashcard recall checks, sentence building, typing, maths missions, and the Latin/Cyrillic alphabet studio. Route all scored outcomes through the shared evidence and mastery interfaces.
- [ ] Implement seven-day charts, day/session details, subject/script mastery, archived weeks, parent approvals, and earned/paid history. Show complete, awaiting approval, approved, and incomplete states distinctly.
- [ ] Add parent setup, current-week rules display, optional name/difficulty controls for future sessions, backup export/import, PIN changes, and visible save-error/conflict handling. Never request a PIN in chat.
- [ ] Verify keyboard and touch interaction, small screens, hints, both scripts, maths, PIN approval, import/export, reload persistence, and navigation during unfinished games. Commit the playable app.

## Task 6 — Offline release and publication

**Files:** `sw.js`, `manifest.webmanifest`, `.nojekyll`, `README.md`, `docs/verification.md`.

- [ ] Add a unique app id, icon set, cache prefix, service-worker scope, and precached local assets. Show offline-ready only after verifying all required assets are cached. No runtime CDN or backend dependency.
- [ ] Run the complete Node suite and syntax checks. Verify a cold offline reopen, new question/answer saving offline, cache updates, fresh-device setup, corrupted data protection, and archived-week retention.
- [ ] Review the app against the approved spec, especially five-day eligibility, both subjects, both scripts, idle time, duplicate credit, and parent verification. Fix findings and rerun the affected checks.
- [ ] Create the separate repository, commit/push only app source and documentation, enable GitHub Pages, and wait for successful deployment. Check the public app, service-worker readiness, and a live game.
- [ ] Deliver the live URL and source link, explain the offline PIN and backup limits briefly, and record actual verification results without claiming physical-device or tamper-proof guarantees.

## Execution recommendation

Implement directly in this chat, task by task, with tests before the reward and persistence logic. This keeps the tightly connected scoring, calendar, and game interfaces consistent. A final independent review can focus on reward bypasses, lost history, and script correctness. Alternatively, use separate implementation/review agents for each task if the parent prefers a more extensive review workflow.
