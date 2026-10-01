# Hunter's Quest — Croatian and maths

## Purpose

Create a separate, colourful Croatian and maths learning app for Hunter, age 10, with enjoyable practice and a parent-verified $10 weekly reward. Publish it as its own GitHub Pages app. The existing Bok! app and its saved progress stay separate.

The parent has chosen **5 qualifying days per Monday–Sunday week**, allowing **2 rest days**, and **offline verification using a parent PIN**.

## Daily quest and reward rules

A day qualifies only when all of these are complete:

- At least **15 minutes of active practice**. Hidden tabs, menus, and idle time do not count. Practice may be split into short sessions.
- At least **3 different game types**, with a minimum of 5 scored items in each qualifying type.
- At least **30 distinct scored items** across the day: at least **10 English-to-Croatian items**, **10 Croatian-to-English items**, and **10 maths problems**. More of one subject cannot replace the other. A matched bilingual pair counts once, not twice; it does not replace the explicit translation-direction targets.
- Mistakes receive explanations and return later. An item counts toward the quest after a successful response without the full answer being revealed. Repeatedly solving the same item in the same game and direction cannot inflate the daily total.
- The parent reviews the evidence and approves the day in the PIN-protected parent area.

Hints start with a meaning clue or first letter. More support is available without shaming the child; revealing the answer is useful learning but does not directly earn quest credit. The app records hint use separately and requires some independently answered questions in both translation directions.

Five approved qualifying days earn **one $10 reward for that week**. Extra practice earns learning progress, not additional cash rewards. The parent can separately mark the reward paid; the app never sends money. Historical weeks can be reviewed and approved later using the evidence recorded on their actual dates.

## Child experience

The home screen shows today's quest as a clear checklist, a seven-day progress trail, and how many verified days remain until the weekly reward. The visual style is a bright game adventure with readable text, large touch targets, original illustrations, and optional short sound effects.

Six themed worlds use his interests to teach everyday Croatian:

1. **Minecraft:** building, blocks, tools, colours, animals, and directions.
2. **Roblox:** teamwork, obstacle courses, movement, friends, and turns.
3. **PS5:** controllers, buttons, menus, playing together, and useful requests.
4. **Harry Potter:** school, books, rooms, potions, animals, and imaginative adventures.
5. **Gaming:** wins and losses, feelings, fair play, numbers, and problem-solving.
6. **Music / Marshmello:** instruments, rhythm, dancing, concerts, and favourites.

Launch with at least **240 authored bilingual words and short phrases**, with simple explanations and age-appropriate examples. Include Hunter naturally in sentences throughout the course: "Hunter gradi kuću" ("Hunter is building a house"), "Hunter ima tri dijamanta" ("Hunter has three diamonds"), and "Hunter sluša glazbu" ("Hunter is listening to music"). Mix these with first-person sentences so he learns to talk about himself too. Use original artwork and original sentences; branded names identify interests rather than suggesting an official affiliation. No external accounts, chat, purchases, lyrics, or streamed songs are needed.

Games include translation quizzes in both directions, a face-down memory-pair game, flashcards with a scored recall check, sentence building, and short typing challenges with Croatian letter buttons. Daily quests mix games and themes. Flashcards can also be browsed freely without earning automatic reward credit.

Adaptive selection introduces new material, revisits weak words, and avoids farming a small set of easy questions. Persistent learning records distinguish recognition from recall and continue across weekly resets.

## Latin and Cyrillic learning — approved addition

Include Latin, Cyrillic, and mixed-script practice, with a side-by-side alphabet guide, letter recognition, paired-script flashcards, and guided uppercase letter tracing. Teach unfamiliar letters gradually with a Latin reading hint before introducing whole words and sentences. Croatian normally uses Latin; explicitly describe Cyrillic as an additional reading/writing exercise using Serbian Cyrillic letter correspondences, not as standard Croatian spelling or a different dialect.

Use authored handling of digraphs and exceptions. In Cyrillic sentences write Hunter's name as **Хантер**, while keeping game and artist brand names in their original form. For example: **Hunter voli glazbu. → Хантер воли глазбу.** Keep language explanations and maths instructions in English. Do not automatically transliterate arbitrary English text.

Save Latin and Cyrillic learning records separately. Show script progress in the chart and historical reports. Reward evidence deduplicates the same translation item across scripts: switching a familiar question from Latin to Cyrillic cannot double its daily cash-reward credit. Cyrillic translation exercises can satisfy the relevant translation-direction requirement. Tracing is useful extra practice but cannot replace the Croatian and maths answer targets.

## Maths subjects

Add a maths learning path with distinct topics: place value and addition/subtraction; multiplication and division; fractions; decimals and money; time; measurement; shape and perimeter; and multi-step word problems. Start with age-10 practice, use worked examples and small hints, and offer parent-controlled difficulty. Do not claim alignment with a particular school syllabus without confirming Hunter's year level.

Use the same interests for original maths stories: Hunter divides building blocks between friends, works out the perimeter of a Minecraft-style garden, calculates a gaming session's finish time, or counts beats in a music pattern. Generate varied, validated problems with exact answers and explicit units. Include visual fraction and shape problems where useful. Repeated or trivially reversed versions of the same problem do not inflate quest progress.

Maths instructions are in clear English, with small optional Croatian vocabulary connections. A maths answer tests the maths rather than requiring Hunter to translate an unfamiliar sentence first. The maths path saves topic mastery and revisits mistakes across weeks. A mixed daily selection prevents completing the maths requirement solely through the easiest topic. Retain the rules and difficulty that applied to each week's evidence.

Additional school subjects can be added as future modules; the initial app includes the explicitly requested Croatian and maths tracks.

## Complete progress chart

The weekly chart has Monday–Sunday rows showing active minutes, scored items, English-to-Croatian progress, Croatian-to-English progress, maths progress, qualifying game types, first-attempt accuracy, hints used, and parent approval. Separate subject charts show Croatian and maths topic progress. Selecting a day opens its session history, words needing practice, and maths topics needing work.

The parent area shows approval controls and a weekly archive with the rules used that week, completed days, earned amount, approval dates, and payment status. A new Monday starts a fresh chart automatically on the next app opening. Previous weeks, earned rewards, and learning records remain saved. Finishing five days highlights the remaining days as optional practice/rest days.

The first partial calendar week is clearly labelled; missed days before setup are not fabricated. The parent can see whether five real practice days remain available.

## Parent controls and storage

Parent setup starts with the learner's name **Hunter** and chooses a PIN and timezone (default Australia/Brisbane). The child does not need an account. PIN setup and entry happen inside the app; never put the PIN in chat or source code. Store a salted PIN verifier and limit repeated guesses.

Save progress after each scored response and completed session using an app-specific storage key. Protect against stale browser tabs overwriting newer progress. Provide parent-only export/import with validation so progress and reward history can be backed up. Show storage failures instead of claiming unsaved practice was saved.

The app is offline-first after the first successful load. Its cache, service-worker scope, manifest, and storage are separate from the existing app. Optional device pronunciation may depend on installed voices; all core games and tracking work without it.

An offline PIN is a household approval gate, **not tamper-proof security**. A technically skilled user can alter browser storage or the device clock. Pause questionable time credit and flag backward clock changes for parent review. The parent remains the authority for approving practice and paying rewards. Clearing browser data can lose records unless a backup exists; a lost PIN has no secret universal override.

## Implementation boundaries and verification

Keep curriculum, practice selection, quest scoring, calendar/week history, storage validation, parent authentication, and UI in separate modules. The reward engine calculates eligibility from saved evidence rather than trusting a writable "earned" checkbox. Approvals and payments retain their timestamps.

Test the five-day threshold, minimum time, three-game requirement, both language directions and the maths requirement, repeated-answer prevention, revealed answers, idle/background time, midnight and Monday boundaries, old-week retention, late parent approval, duplicate payment prevention, corrupted backups, and stale tabs. Test generated maths answers, fraction equivalence, money rounding, valid geometry, and varied topic selection. Verify games, hints, parent controls, responsive layout, saving/reopening, and offline loading in the browser. Publish only after those checks pass, then verify the live GitHub Pages deployment.

## Design review

The parent approved this design and requested the Cyrillic addition. The next step is review of the implementation plan, then building and publishing the separate app. No new app code has been written yet.
