const { buildReport, toJSON, toCSV, toText } = require('../src/json');

const raw = {
  totalLines: 5,
  validLines: 4,
  errorLines: 1,
  matchedEvents: 3,
  aggregation: {
    byLevel: [['ERROR', 2], ['INFO', 1]],
    bySource: [['gateway', 2], ['auth-api', 1]],
    topCodes: [['HTTP_502', 2], ['AUTH_LOGIN_OK', 1]]
  }
};

describe('buildReport', () => {
  test('формирует объект', () => {
    const r = buildReport(raw);
    expect(r.totalLines).toBe(5);
    expect(r.byLevel).toEqual({ ERROR: 2, INFO: 1 });
    expect(r.topCodes).toEqual([
      { code: 'HTTP_502', count: 2 },
      { code: 'AUTH_LOGIN_OK', count: 1 }
    ]);
  });
});

describe('toJSON', () => {
  test('валидный JSON', () => {
    const s = toJSON(buildReport(raw));
    expect(() => JSON.parse(s)).not.toThrow();
    expect(JSON.parse(s).totalLines).toBe(5);
  });
});

describe('toCSV', () => {
  test('содержит summary и секции', () => {
    const s = toCSV(buildReport(raw));
    expect(s).toContain('section,key,value');
    expect(s).toContain('summary,totalLines,5');
    expect(s).toContain('byLevel,ERROR,2');
    expect(s).toContain('topCodes,HTTP_502,2');
  });
});

describe('toText', () => {
  test('содержит сводку', () => {
    const s = toText(buildReport(raw));
    expect(s).toContain('Всего строк: 5');
    expect(s).toContain('Корректных: 4');
    expect(s).toContain('Ошибочных: 1');
  });
});