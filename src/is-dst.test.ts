import { getDstRef, isDst } from './is-dst';

describe('isDst functions', () => {
  describe('getDstRef', () => {
    describe('by country', () => {
      it('should get Canadian default refs', () => {
        const expected = getDstRef('CAN');
        expect(expected).toHaveProperty('timezone');
        expect(expected).toHaveProperty('refs');
      });

      it('should get French default refs', () => {
        const expected = getDstRef('FRA');
        expect(expected).toHaveProperty('timezone');
        expect(expected).toHaveProperty('refs');
      });

      it('should get American default refs', () => {
        const expected = getDstRef('USA');
        expect(expected).toHaveProperty('timezone');
        expect(expected).toHaveProperty('refs');
      });

      it('should get Australian default refs', () => {
        const expected = getDstRef('AUS');
        expect(expected).toHaveProperty('timezone');
        expect(expected).toHaveProperty('refs');
      });
    });

    it("should FAIL if country doesn't exist", () => {
      expect(() => getDstRef('FOOBAR' as any, true)).toThrow(
        "Refs don't exist for this ISO country code (FOOBAR)"
      );
    });

    it("should WARN if country doesn't exist", () => {
      console.warn = jest.fn();
      getDstRef('FOOBAR' as any);
      expect(console.warn).toHaveBeenCalledWith(
        "Refs don't exist for this ISO country code (FOOBAR)"
      );
    });

    it('should get Quebec default refs', () => {
      const expected = getDstRef('CAN.QUEBEC');

      expect(expected).toHaveProperty('timezone');
      expect(expected).toHaveProperty('refs');
      expect(expected.refs[2000]).toEqual([
        '2000-04-02 02:00:00',
        '2000-10-29 02:00:00'
      ]);
    });

    it("should FAIL if state doesn't exist", () => {
      expect(() => {
        getDstRef('CAN.FOOBAR' as any, true);
      }).toThrow(
        "State (FOOBAR) doesn't exist for this ISO country code (CAN)"
      );
    });

    it("should WARN if state doesn't exist", () => {
      console.warn = jest.fn();
      getDstRef('CAN.FOOBAR' as any);
      expect(console.warn).toHaveBeenCalledWith(
        "State (FOOBAR) doesn't exist for this ISO country code (CAN)"
      );
    });

    it('should get Montreal default refs', () => {
      const expected = getDstRef('CAN.QUEBEC.MONTREAL');

      expect(expected).toHaveProperty('timezone');
      expect(expected).toHaveProperty('refs');
      expect(expected.refs[2000]).toEqual([
        '2000-04-02 02:00:00',
        '2000-10-29 02:00:00'
      ]);
    });

    it("should FAIL if city doesn't exist", () => {
      expect(() => {
        getDstRef('CAN.QUEBEC.FOOBAR' as any, true);
      }).toThrow(`City (FOOBAR) doesn't exist for "CAN/QUEBEC"`);
    });

    it("should WARN if city doesn't exist", () => {
      console.warn = jest.fn();
      getDstRef('CAN.QUEBEC.FOOBAR' as any);
      expect(console.warn).toHaveBeenCalledWith(
        `City (FOOBAR) doesn't exist for "CAN/QUEBEC"`
      );
    });

    it('should get Ontario default refs', () => {
      const expected = getDstRef('CAN.ONTARIO', true);

      expect(expected).toHaveProperty('timezone', 'America/Toronto');
      expect(expected).toHaveProperty('refs');
    });

    it('should get Toronto default refs', () => {
      const expected = getDstRef('CAN.ONTARIO.TORONTO', true);

      expect(expected).toHaveProperty('timezone', 'America/Toronto');
      expect(expected.refs[2000]).toEqual([
        '2000-04-02 02:00:00',
        '2000-10-29 02:00:00'
      ]);
    });

    it('should use the matching year in Canadian refs before 2000', () => {
      const { refs } = getDstRef('CAN');

      for (let year = 1980; year < 2000; year++) {
        expect(refs[year][0].startsWith(`${year}-`)).toBe(true);
        expect(refs[year][1].startsWith(`${year}-`)).toBe(true);
      }
    });
  });
  describe('isDst', () => {
    it('should be in DST for Toronto the 2012-07-24 00:00:00', () => {
      const expected = isDst(new Date('2012-07-24 00:00:00'), {
        location: 'CAN.ONTARIO.TORONTO',
        failIfNotExisting: true
      });
      expect(expected).toBeTruthy();
    });

    it('should be in DST for Montreal the 1985-07-24 00:00:00', () => {
      const expected = isDst(new Date('1985-07-24 00:00:00'), {
        location: 'CAN.QUEBEC.MONTREAL',
        failIfNotExisting: true
      });
      expect(expected).toBeTruthy();
    });

    it('should be in DST for Montreal the 1990-10-26 12:00:00', () => {
      const expected = isDst(new Date('1990-10-26 12:00:00'), {
        location: 'CAN.QUEBEC.MONTREAL',
        failIfNotExisting: true
      });
      expect(expected).toBeTruthy();
    });

    it('should NOT be in DST for Canada the 2012-12-24 00:00:00', () => {
      const expected = isDst(new Date('2012-12-24 00:00:00'), {
        location: 'CAN'
      });
      expect(expected).toBeFalsy();
    });

    it('should be in DST for Montreal the 2012-03-24 00:00:00', () => {
      const expected = isDst(new Date('2012-03-24 00:00:00'), {
        location: 'CAN.QUEBEC.MONTREAL',
        failIfNotExisting: true
      });
      expect(expected).toBeTruthy();
    });

    it('should FAIL if date is not implemented', () => {
      expect(() =>
        isDst(new Date('1912-03-24 00:00:00'), {
          location: 'CAN.QUEBEC.MONTREAL',
          failIfNotExisting: true
        })
      ).toThrow(`DST doesn't exist for this year (1912)`);
    });

    it("should WARN if date doesn't exist", () => {
      console.warn = jest.fn();
      isDst(new Date('1912-03-24 00:00:00'), {
        location: 'CAN.QUEBEC.MONTREAL',
        failIfNotExisting: false
      });
      expect(console.warn).toHaveBeenCalledWith(
        `DST doesn't exist for this year (1912)`
      );
    });

    it('should FAIL if the date is not correct', () => {
      expect(() => {
        isDst(null, null);
      }).toThrow();
    });

    it('should NO be in DST with state with no DST', () => {
      const expected = isDst(new Date('2012-08-24 00:00:00'), {
        location: 'USA.HAWAII'
      });
      expect(expected).toBeFalsy();
    });

    it('should be in DST for USA the 2012-07-24 00:00:00', () => {
      const expected = isDst(new Date('2012-07-24 00:00:00'), {
        location: 'USA',
        failIfNotExisting: true
      });
      expect(expected).toBeTruthy();
    });

    it('should NOT be in DST for USA the 2012-12-24 00:00:00', () => {
      const expected = isDst(new Date('2012-12-24 00:00:00'), {
        location: 'USA',
        failIfNotExisting: true
      });
      expect(expected).toBeFalsy();
    });

    it('should be in DST for Paris the 1985-07-24 00:00:00', () => {
      const expected = isDst(new Date('1985-07-24 00:00:00'), {
        location: 'FRA.METROPOLE.PARIS',
        failIfNotExisting: true
      });
      expect(expected).toBeTruthy();
    });

    it('should NOT be in DST for Paris the 1985-10-15 00:00:00', () => {
      const expected = isDst(new Date('1985-10-15 00:00:00'), {
        location: 'FRA.METROPOLE.PARIS',
        failIfNotExisting: true
      });
      expect(expected).toBeFalsy();
    });

    it('should NOT be in DST for Victoria the 2012-07-24 00:00:00', () => {
      const expected = isDst(new Date('2012-07-24 00:00:00'), {
        location: 'AUS.VICTORIA'
      });
      expect(expected).toBeFalsy();
    });

    it('should be in DST for Melbourne the 2012-12-24 00:00:00', () => {
      const expected = isDst(new Date('2012-12-24 00:00:00'), {
        location: 'AUS.VICTORIA.MELBOURNE'
      });
      expect(expected).toBeTruthy();
    });
  });
});
