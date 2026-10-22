const { createAggregator, sortedEntries } = require('../src/agregator');

describe('createAggregator', () => {
  test('считает по уровням/источникам/кодам', () => {
    const agg = createAggregator();
    agg.add({ level: 'ERROR', source: 'gateway', eventCode: 'HTTP_502' });
    agg.add({ level: 'ERROR', source: 'gateway', eventCode: 'HTTP_502' });
    agg.add({ level: 'INFO', source: 'auth-api', eventCode: 'AUTH_LOGIN_OK' });

    const res = agg.result(10);
    expect(res.byLevel).toEqual([['ERROR', 2], ['INFO', 1]]);
    expect(res.bySource).toEqual([['gateway', 2], ['auth-api', 1]]);
    expect(res.topCodes).toEqual([['HTTP_502', 2], ['AUTH_LOGIN_OK', 1]]);
  });

  test('top-N ограничивает', () => {
    const agg = createAggregator();
    agg.add({ level: 'ERROR', source: 'a', eventCode: 'A' });
    agg.add({ level: 'ERROR', source: 'a', eventCode: 'B' });
    agg.add({ level: 'ERROR', source: 'a', eventCode: 'C' });
    expect(agg.result(2).topCodes.length).toBe(2);
  });

  test('детерминированность при равных count', () => {
    const agg = createAggregator();
    agg.add({ level: 'ERROR', source: 'a', eventCode: 'B' });
    agg.add({ level: 'ERROR', source: 'a', eventCode: 'A' });
    expect(agg.result(10).topCodes).toEqual([['A', 1], ['B', 1]]);
  });
});

describe('sortedEntries', () => {
  test('сортирует по count desc, затем key asc', () => {
    const m = new Map([['B', 1], ['A', 1], ['C', 2]]);
    expect(sortedEntries(m)).toEqual([['C', 2], ['A', 1], ['B', 1]]);
  });
});