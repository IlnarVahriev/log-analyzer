const { parseLine, Timestamp } = require('../src/parser');

describe('parseLine', () => {
  test('корректная строка парсится', () => {
    const ev = parseLine('2026-09-01T00:08:59Z | WARN | auth-api | AUTH_LOGIN_OK | User session created');
    expect(ev).toEqual({
      timestamp: '2026-09-01T00:08:59Z',
      level: 'WARN',
      source: 'auth-api',
      eventCode: 'AUTH_LOGIN_OK',
      message: 'User session created'
    });
  });

  test('невалидный timestamp → null', () => {
    expect(parseLine('not-a-timestamp | ERROR | orders-api | ORDER_REJECTED | x')).toBeNull();
  });

  test('timestamp без T/Z → null', () => {
    expect(parseLine('2026-09-04 09:00:00 | WARN | inventory-api | STOCK_LOW | x')).toBeNull();
  });

  test('невалидный level → null', () => {
    expect(parseLine('2026-09-02T08:12:00Z | NOTICE | gateway | HTTP_502 | x')).toBeNull();
  });

  test('пустой level → null', () => {
    expect(parseLine('2026-09-07T14:00:00Z |  | gateway | HTTP_502 | empty')).toBeNull();
  });

  test('пустой source → null', () => {
    expect(parseLine('2026-09-07T14:00:00Z | INFO |  | HTTP_502 | x')).toBeNull();
  });

  test('пустой eventCode → null', () => {
    expect(parseLine('2026-09-03T09:00:00Z | INFO | auth-api | | missing')).toBeNull();
  });

  test('пустой message → null', () => {
    expect(parseLine('2026-09-08T14:00:00Z | ERROR | gateway | HTTP_502 | ')).toBeNull();
  });

  test('| внутри message (6 полей) → null', () => {
    expect(parseLine('2026-09-06T11:10:00Z | ERROR | payment-worker | PAYMENT_TIMEOUT | a | b')).toBeNull();
  });

  test('4 поля → null', () => {
    expect(parseLine('2026-09-05T11:10:00Z | ERROR | payment-worker | PAYMENT_TIMEOUT')).toBeNull();
  });

  test('пустая строка → null', () => {
    expect(parseLine('')).toBeNull();
    expect(parseLine('   ')).toBeNull();
  });

  test('null/undefined → null', () => {
    expect(parseLine(null)).toBeNull();
    expect(parseLine(undefined)).toBeNull();
  });
});

describe('Timestamp', () => {
  test('корректный', () => expect(Timestamp('2026-09-01T00:08:59Z')).toBe(true));
  
  test('некорректный', () => {
    expect(Timestamp('2026-13-01T00:08:59Z')).toBe(false);
    expect(Timestamp('abc')).toBe(false);
    expect(Timestamp(null)).toBe(false); // Это сработает, благодаря защите в parser.js
  });
});
