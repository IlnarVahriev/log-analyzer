const { matches } = require('../src/filter');

const ev = {
  timestamp: '2026-09-02T10:00:00Z',
  level: 'ERROR',
  source: 'gateway',
  eventCode: 'HTTP_502',
  message: 'x'
};

describe('matches', () => {
  test('без фильтров — проходит', () => expect(matches(ev, {})).toBe(true));

  test('from включительно', () => {
    expect(matches(ev, { from: '2026-09-02T10:00:00Z' })).toBe(true);
  });

  test('to исключительно', () => {
    expect(matches(ev, { to: '2026-09-02T10:00:00Z' })).toBe(false);
    expect(matches(ev, { to: '2026-09-02T10:00:01Z' })).toBe(true);
  });

  test('level фильтр', () => {
    expect(matches(ev, { level: 'ERROR' })).toBe(true);
    expect(matches(ev, { level: 'INFO' })).toBe(false);
  });

  test('source фильтр', () => {
    expect(matches(ev, { source: 'gateway' })).toBe(true);
    expect(matches(ev, { source: 'auth-api' })).toBe(false);
  });

  test('сочетание фильтров', () => {
    expect(matches(ev, {
      from: '2026-09-02T00:00:00Z',
      to: '2026-09-03T00:00:00Z',
      level: 'ERROR',
      source: 'gateway'
    })).toBe(true);

    expect(matches(ev, {
      from: '2026-09-02T00:00:00Z',
      to: '2026-09-03T00:00:00Z',
      level: 'INFO',
      source: 'gateway'
    })).toBe(false);
  });
});