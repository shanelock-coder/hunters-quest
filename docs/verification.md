# Release verification

44 Node tests pass. Coverage includes five-day rewards and approval gates, duplicate evidence, delayed recall, time boundaries, idle time, independent-answer history across restarts, persisted hints, separate recall schedules, malformed/blocked storage, stale tabs, transactional parent writes, PIN hashing/lockout, all tracing glyphs, and 2,880 seeded maths cases.

Browser checks completed in the Codex in-app Chromium browser: first-run setup on a local test profile, correct and wrong PIN, Croatian answers and hints, mixed Cyrillic, maths answer/feedback, navigation from unfinished rounds, saved results after reload, seven-day chart, parent controls, desktop and phone-width rendering (390-pixel viewport, no page-level horizontal overflow), cached-assets-ready notification, and service-worker update installation. No application console errors were observed during these checks.

The browser download-event interface timed out during backup export; actual downloaded-file delivery and file-chooser restore were not verified through that interface. Backup validation, round trips, invalid input preservation and write failures are covered by module tests. Physical iOS/Android installation and optional device voices have not been tested.

An independent whole-app review found six important edge cases. Regression tests reproduced each before fixes: restarting first-attempt eligibility, blocked storage getter, parent writes announcing success before saving, backward-clock time credit, delayed intervals crossing midnight, and merged recognition/recall schedules. All now pass. Rest/optional-day states and historical review metadata were also added and tested.

Implementation decisions: a new independent repository protects the existing Bok app; native Windows bookkeeping replaced bash-only helpers; publication followed the user’s existing authorization. Offline local storage and device time remain a household trust mechanism, as approved. No native-speaker certification or formal school-syllabus alignment is claimed.
