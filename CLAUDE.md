# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`localized-dst` is a small TypeScript npm library exposing a single function, `isDst(date, { location, failIfNotExisting? })`, that reports whether a date falls in daylight saving time for a country/state/city. DST transitions are **hard-coded per year** (sourced from https://www.timeanddate.com/time/dst/), not computed from rules.

## Commands

```bash
npm ci                        # install
npm run build                 # tsc -> dist/ (test files excluded)
npm test                      # jest with coverage
npm run test:watch            # jest watch mode
npx jest -t 'Montreal'        # run tests whose name matches a pattern
npm run prettier-format       # format src/**/*.ts with .prettierrc
npm run publish-dryrun        # build + npm publish --dry-run
```

There is no lint script, and the ESLint packages referenced by `.eslintrc` are not in `devDependencies`. Prettier is the enforced style: single quotes, semicolons, no trailing commas, 80 columns.

CI (`.github/workflows/pull_request.yml`) runs `npm ci && npm run build && npm test` on Node 24 for every PR. Jest 30 needs Node 18.14 or newer.

TypeScript stays on 6.x because `ts-jest` doesn't support TypeScript 7 yet (peer range `<7`). `tsconfig.json` explicitly sets `strict: false`, `types: ["jest"]` and `rootDir` because TypeScript 6 changed their defaults. It sets `skipLibCheck` because date-fns 4's types reference `Intl` APIs that aren't in the `es2015` lib.

## Architecture

- `src/is-dst.ts` holds all the logic. `getDstRef(location)` splits the location key on `.` into `COUNTRY.STATE.CITY`, maps the country code to a data module through a `switch` in `getCountryDstRef`, and then walks `states` → `cities`. Each level falls back to its `defaultDstRef` when the next segment is missing. `isDst` reads `refs[getYear(date)]` and returns `start < date < end` (both bounds exclusive). Each bound is a local wall-clock string parsed in the ref's IANA `timezone` with `moment.tz`.
- `src/dst/models.ts` defines the data shape: `CountryDst` → `states[STATE]` → `cities[CITY]`, each with a `defaultDstRef: { timezone, refs }`. `refs` is either `{ [year]: [startLocal, endLocal] }` or `false`, meaning the location has no DST.
- `src/dst/<country>-dst.ts` contains one data file per country. Each exports a default `CountryDst` and a string-literal union type of valid location keys (for example, `FranceDstLocation`).
- Unknown locations or years produce a `console.warn` and return `null`/`false`. If `failIfNotExisting: true` is set, they throw instead. The tests assert on these exact message strings.

### Adding a country, state, or city

1. Create or extend `src/dst/<country>-dst.ts`. Country codes are ISO 3166 alpha-3, and state and city keys are UPPERCASE.
2. Add the new keys to that file's `...DstLocation` union type.
3. For a new country, import it in `src/is-dst.ts`, add a `case` to `getCountryDstRef`, and add its location type to `Options['location']`.
4. Update the "Implemented DST data" table in `README.md`.
5. Add tests in `src/is-dst.test.ts`. It is the only test file.

## Gotchas

- **Southern hemisphere:** a year's entry spans two calendar years. For example, Victoria's `2012` entry runs from Oct 2012 to Mar 2013. `isDst` only looks up `getYear(date)`, so January–March dates are checked against the period that starts *later* that year and come back `false`.
- **`refs: false` (no DST):** `isDst` treats this the same as a missing year. It warns and returns `false`, or throws when `failIfNotExisting` is set.
- **Generating data:** generate DST dates from the IANA tz database bundled in `moment-timezone` (`moment.tz.zone(tz).untils`/`offsets`) instead of typing them by hand. Write each transition as a local wall-clock time using the offset in effect *before* it, so the end time is in DST time (for example, France ends at `03:00:00`).
