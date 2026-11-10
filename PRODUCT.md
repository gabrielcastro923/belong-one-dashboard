# Path to 20 — product

## Who

Gabriel Castro, Homeowner Advisor at Belong (single-family rental management), Miami / Eastern Time.
One user. He opens this between calls: on a laptop at his desk, on a phone in the hallway or the car,
for 10–60 seconds at a time. He knows every term on the screen; nothing needs explaining on first sight.

## Mode

**Operate.** A tool he works from, not a report he reads. Scanability, consistency and the real usage
scene (a phone, one thumb, a call about to start) outrank expression.

## The one question per page

| Route | Question |
|---|---|
| `/` | Am I on pace for 20 listings in November, and where do the missing ones come from? |
| `/plan` | Who do I dial next, at what number, for what goal, and what time is it for them? |
| `/leads` | Which open deal needs me, filtered and sorted the way I am thinking right now? |
| `/outreach` | Which email lane is booking calls, which is failing, and what should change? |
| `/progress` | Is the month's line above the checkpoint pace, and did I tick my calls? |
| `/agents` | Which automation is broken or late? |
| `/unlock` | Enter the key. |

## Truth and constraints

- Data is static JSON in `public/data`, built by `Tools/scripts/build_plan.py` and `build_outreach.py`.
  The site never changes a number, a label's meaning, or the stage taxonomy.
- The CRM of record is the advisor pipeline; this site is derived. Snapshot time must always be visible.
- Checkboxes and day counters live in this browser's localStorage only.
- Behind a key (middleware + `/unlock`) because it holds homeowner phone numbers.

## Problems the screen must surface without hovering

- Listings, calls held or inspections below floor or behind a missed Friday checkpoint.
- A FAILING send lane or automation; failed sends; owner replies waiting for an answer.
- A stale snapshot (older than 26 h) or placeholder data.

## Taste

Gabriel's words: "make it clean, make it not look AI, sleek colorful style." Colour follows the entity
(stage family, send lane); warm red/amber only for problems; calm chrome.
