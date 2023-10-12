import {
  dateToKey,
  keyToDate,
  getFormattedTimeStringFromDate,
  getDateEndAnchor,
  getDateStartAnchor,
  getTimesBetween,
  getDateFromTimeString,
} from './timeMath';

describe('Time Utilities', () => {
  describe('dateToKey', () => {
    it('should return empty string for undefined date', () => {
      expect(dateToKey()).toBe('');
    });

    it('should return "invalid" for invalid dates', () => {
      const invalidDate = new Date('invalid-date');
      expect(dateToKey(invalidDate)).toBe('invalid');
    });

    it('should return ISO string for valid dates', () => {
      const date = new Date(2023, 9, 6);
      expect(dateToKey(date)).toBe(date.toISOString());
    });
  });

  describe('keyToDate', () => {
    it('should return undefined for empty string', () => {
      expect(keyToDate('')).toBeUndefined();
    });

    it('should return undefined for "invalid" string', () => {
      expect(keyToDate('invalid')).toBeUndefined();
    });

    it('should return date for valid ISO string', () => {
      const date = new Date(2023, 9, 6);
      expect(keyToDate(date.toISOString())).toEqual(date);
    });
  });

  describe('dateToKey and keyToDate correspondence', () => {
    it('should be inverses of each other for valid dates', () => {
      const originalDate = new Date(2023, 9, 6, 23, 45, 12);
      const key = dateToKey(originalDate);
      const revertedDate = keyToDate(key);

      expect(revertedDate?.getTime()).toEqual(originalDate.getTime());
    });

    it('should be inverses of each other for undefined date', () => {
      const originalDate = undefined;
      const key = dateToKey(originalDate);
      const revertedDate = keyToDate(key);

      expect(revertedDate).toEqual(originalDate);
    });

    it('should be inverses of each other for invalid dates', () => {
      const originalDate = new Date('invalid-date');
      const key = dateToKey(originalDate);
      const revertedDate = keyToDate(key);

      expect(revertedDate).toBeUndefined();
    });
  });

  describe('getFormattedTimeStringFromDate', () => {
    const testDate = new Date(2023, 9, 6, 23, 45, 12);

    it('should format time in 24-hour format without seconds', () => {
      expect(getFormattedTimeStringFromDate(testDate)).toBe('23:45');
    });

    it('should format time in 24-hour format with seconds', () => {
      expect(getFormattedTimeStringFromDate(testDate, { showSeconds: true })).toBe('23:45:12');
    });

    it('should format time in 12-hour format with seconds', () => {
      expect(getFormattedTimeStringFromDate(testDate, { showSeconds: true, hour12: true })).toBe('11:45:12 PM');
    });

    it('should format midnight correctly in 24-hour format', () => {
      const midnight = new Date(2023, 9, 7, 0, 0, 0);
      expect(getFormattedTimeStringFromDate(midnight)).toBe('00:00');
    });

    it('should format time in Japanese locale', () => {
      const { toLocaleTimeString } = Date.prototype;
      const toLocaleTimeStringMock = jest.spyOn(Date.prototype, 'toLocaleTimeString');
      // Mock toLocaleTimeString to simulate running in a Japanese locale
      toLocaleTimeStringMock.mockImplementation(function (this: Date, _locales, options) {
        return toLocaleTimeString.call(this, 'ja-JP', options);
      });

      expect(getFormattedTimeStringFromDate(testDate, { showSeconds: true, hour12: true })).toBe('午後11:45:12');

      toLocaleTimeStringMock.mockClear();
    });
  });

  describe('Anchor Date Calculations', () => {
    it('should calculate the correct start anchor date', () => {
      const date = new Date(2023, 9, 6);
      const result = getDateStartAnchor(date, 5);
      expect(result.getHours()).toBe(5);
    });

    it('should calculate the correct end anchor date (same day)', () => {
      const date = new Date(2023, 9, 6);
      const result = getDateEndAnchor(date, 5, 10);
      expect(result.getHours()).toBe(10);
    });

    it('should calculate the correct end anchor date (next day)', () => {
      const date = new Date(2023, 9, 6);
      const result = getDateEndAnchor(date, 10, 5);
      expect(result.getHours()).toBe(5);
      expect(result.getDate()).toBe(7);
    });

    it('should handle the endHour being 24 correctly', () => {
      const date = new Date(2023, 9, 6);
      const result = getDateEndAnchor(date, 10, 24);
      expect(result.getHours()).toBe(0);
      expect(result.getDate()).toBe(7);
    });
  });

  describe('getTimesBetween', () => {
    it('should return correct Date objects with 15-minute increment', () => {
      const start = new Date('January 1, 2023 10:00:00');
      const end = new Date('January 1, 2023 11:00:00');
      const result = getTimesBetween(start, end, 15);

      expect(result.length).toBe(4);
      result.forEach((date, i) => expect(date.getMinutes()).toBe(15 * i));
    });

    it('should return correct Date objects spanning across midnight with 30-minute increment', () => {
      const start = new Date('January 1, 2023 23:30:00');
      const end = new Date('January 2, 2023 00:30:00');
      const result = getTimesBetween(start, end, 30);

      expect(result.length).toBe(2);
      expect([result[0].getHours(), result[0].getMinutes()]).toEqual([23, 30]);
      expect([result[1].getHours(), result[1].getMinutes()]).toEqual([0, 0]);
    });
  });

  describe('getDateFromTimeString', () => {
    const dateStartAnchor = new Date('November 25, 2023 12:00:00');
    const dateEndAnchor = new Date('November 26, 2023 12:00:00');

    it('returns a valid date when given a valid time string', () => {
      const result = getDateFromTimeString('2:30 PM', dateStartAnchor, dateEndAnchor, {
        hour12: true,
        showSeconds: false,
      });
      expect(result.date?.getHours()).toBe(14);
      expect(result.date?.getMinutes()).toBe(30);
      expect(result.error).toBeUndefined();
    });

    it('returns an error when no time string is provided', () => {
      const result = getDateFromTimeString(undefined, dateStartAnchor, dateEndAnchor, {});
      expect(result.date).toBeUndefined();
      expect(result.error).toBe('invalid-input');
    });

    it('returns an error for an invalid time string', () => {
      const result = getDateFromTimeString('25:30', dateStartAnchor, dateEndAnchor, {});
      expect(result.date).toBeUndefined();
      expect(result.error).toBe('invalid-input');
    });

    it('returns a date in the next day and an out-of-bounds error when the time is before the dateStartAnchor', () => {
      const result = getDateFromTimeString('1:30 PM', dateStartAnchor, new Date('November 25, 2023 13:00:00'), {
        hour12: true,
        showSeconds: false,
      });
      expect(result.date?.getHours()).toBe(13);
      expect(result.date?.getMinutes()).toBe(30);
      expect(result.error).toBe('out-of-bounds');
    });
  });
});
