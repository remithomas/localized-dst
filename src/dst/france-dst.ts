import { CountryDst, DstRefs, DstRefsByYear } from './models';

export type FranceDstLocation = 'FRA' | 'FRA.METROPOLE' | 'FRA.METROPOLE.PARIS';

const refs: DstRefsByYear = {
  2000: ['2000-03-26 02:00:00', '2000-10-29 03:00:00'],
  2001: ['2001-03-25 02:00:00', '2001-10-28 03:00:00'],
  2002: ['2002-03-31 02:00:00', '2002-10-27 03:00:00'],
  2003: ['2003-03-30 02:00:00', '2003-10-26 03:00:00'],
  2004: ['2004-03-28 02:00:00', '2004-10-31 03:00:00'],
  2005: ['2005-03-27 02:00:00', '2005-10-30 03:00:00'],
  2006: ['2006-03-26 02:00:00', '2006-10-29 03:00:00'],
  2007: ['2007-03-25 02:00:00', '2007-10-28 03:00:00'],
  2008: ['2008-03-30 02:00:00', '2008-10-26 03:00:00'],
  2009: ['2009-03-29 02:00:00', '2009-10-25 03:00:00'],
  2010: ['2010-03-28 02:00:00', '2010-10-31 03:00:00'],
  2011: ['2011-03-27 02:00:00', '2011-10-30 03:00:00'],
  2012: ['2012-03-25 02:00:00', '2012-10-28 03:00:00'],
  2013: ['2013-03-31 02:00:00', '2013-10-27 03:00:00'],
  2014: ['2014-03-30 02:00:00', '2014-10-26 03:00:00'],
  2015: ['2015-03-29 02:00:00', '2015-10-25 03:00:00'],
  2016: ['2016-03-27 02:00:00', '2016-10-30 03:00:00'],
  2017: ['2017-03-26 02:00:00', '2017-10-29 03:00:00'],
  2018: ['2018-03-25 02:00:00', '2018-10-28 03:00:00'],
  2019: ['2019-03-31 02:00:00', '2019-10-27 03:00:00'],
  2020: ['2020-03-29 02:00:00', '2020-10-25 03:00:00'],
  2021: ['2021-03-28 02:00:00', '2021-10-31 03:00:00'],
  2022: ['2022-03-27 02:00:00', '2022-10-30 03:00:00'],
  2023: ['2023-03-26 02:00:00', '2023-10-29 03:00:00'],
  2024: ['2024-03-31 02:00:00', '2024-10-27 03:00:00'],
  2025: ['2025-03-30 02:00:00', '2025-10-26 03:00:00'],
  2026: ['2026-03-29 02:00:00', '2026-10-25 03:00:00'],
  2027: ['2027-03-28 02:00:00', '2027-10-31 03:00:00'],
  2028: ['2028-03-26 02:00:00', '2028-10-29 03:00:00'],
  2029: ['2029-03-25 02:00:00', '2029-10-28 03:00:00'],
  2030: ['2030-03-31 02:00:00', '2030-10-27 03:00:00']
};

const DEFAULT_AS_PARIS: DstRefs = {
  timezone: 'Europe/Paris',
  refs
};

const country: CountryDst = {
  countryCode: 'FRA',
  defaultDstRef: DEFAULT_AS_PARIS,
  states: {
    METROPOLE: {
      defaultDstRef: DEFAULT_AS_PARIS,
      cities: {
        PARIS: {
          defaultDstRef: DEFAULT_AS_PARIS
        }
      }
    }
  }
};

export default country;