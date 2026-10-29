# localized DST

`Determine if a date is in daylight savings time by country/state/city`

## Motivation

I wasn't able to find a correct library to do the simple task `is my date during DST (Daylight Savings Time`. Every library was old or unconstistant because I learnt the hard way but not every Country/State/City have the same DST...

This is based on the information of https://www.timeanddate.com/time/dst/

## Installation

```bash
npm install localized-dst
```

or

```bash
yarn add localized-dst
```

## How to use it

```ts
import { isDst } from 'localized-dst';

// DST info for Canada, Québec, Montréal
console.log(
  isDst(new Date('2019-08-14 21:00:00'), {
    location: 'CAN.QUEBEC.MONTREAL'
  })
);
// return true

// DST info for France (Paris)
console.log(
  isDst(new Date('2019-11-28 21:00:00'), {
    location: 'FRA'
  })
);
// return false
```

## Implemented DST data

| Country   | State     | City      | Key                        | Years     |
| --------- | --------- | --------- | -------------------------- | --------- |
| Australia | Victoria  | Melbourne | `AUS.VICTORIA.MELBOURNE`   | 1980-2030 |
| Canada    | Quebec    | Montreal  | `CAN.QUEBEC.MONTREAL`      | 1980-2030 |
|           | Ontario   | Toronto   | `CAN.ONTARIO.TORONTO`      | 1980-2030 |
| France    | Metropole | Paris     | `FRA.METROPOLE.PARIS`      | 1980-2030 |
| USA       |           |           | `USA` (Eastern time)       | 1980-2030 |
|           | Hawaii    |           | `USA.HAWAII` (no DST)      | all       |

## How to participate

If you think something is missing or corrupted, please submit a PR to this repo!

### Some tools

- You have created your file and want to modify this README, use this tool (https://www.tablesgenerator.com/markdown_tables) to generate/modify the table.
