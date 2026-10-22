const fs = require('fs');
const os = require('os');
const path = require('path');
const { analyze } = require('../index');

function tmpFile(content) {
  const p = path.join(os.tmpdir(), 'log-test-' + Date.now() + '-' + Math.random() + '.log');
  fs.writeFileSync(p, content, 'utf8');
  return p;
}

describe('analyze (интеграционные)', () => {
  test('считает корректные и ошибочные строки', async () => {
    const p = tmpFile([
      '2026-09-01T00:00:00Z | ERROR | gateway | HTTP_502 | x',
      '2026-09-01T00:00:01Z | INFO | auth-api | AUTH_LOGIN_OK | y',
      'broken line',
      ''
    ].join('\n'));

    const report = await analyze({ input: p, top: '5' });
    expect(report.totalLines).toBe(3);
    expect(report.validLines).toBe(2);
    expect(report.errorLines).toBe(1);
    expect(report.matchedEvents).toBe(2);

    fs.unlinkSync(p);
  });

  test('фильтры сочетаются', async () => {
    const p = tmpFile([
      '2026-09-01T00:00:00Z | ERROR | gateway | HTTP_502 | x',
      '2026-09-01T01:00:00Z | ERROR | gateway | HTTP_502 | y',
      '2026-09-01T02:00:00Z | INFO | auth-api | AUTH_LOGIN_OK | z'
    ].join('\n'));

    const report = await analyze({
      input: p,
      from: '2026-09-01T00:00:00Z',
      to: '2026-09-01T02:00:00Z',
      level: 'ERROR',
      source: 'gateway',
      top: '5'
    });
    expect(report.matchedEvents).toBe(2);

    fs.unlinkSync(p);
  });

  test('сохраняет JSON', async () => {
    const p = tmpFile('2026-09-01T00:00:00Z | ERROR | gateway | HTTP_502 | x');
    const out = p + '.json';
    await analyze({ input: p, top: '5', output: out, format: 'json' });
    const parsed = JSON.parse(fs.readFileSync(out, 'utf8'));
    expect(parsed.totalLines).toBe(1);
    fs.unlinkSync(p);
    fs.unlinkSync(out);
  });

  test('сохраняет CSV', async () => {
    const p = tmpFile('2026-09-01T00:00:00Z | ERROR | gateway | HTTP_502 | x');
    const out = p + '.csv';
    await analyze({ input: p, top: '5', output: out, format: 'csv' });
    const csv = fs.readFileSync(out, 'utf8');
    expect(csv).toContain('section,key,value');
    fs.unlinkSync(p);
    fs.unlinkSync(out);
  });

  test('ошибка: нет input', async () => {
    await expect(analyze({})).rejects.toThrow('Не указан --input');
  });

  test('ошибка: файл не найден', async () => {
    await expect(analyze({ input: '/no/such/file.log' }))
      .rejects.toThrow('Файл не найден');
  });

  test('ошибка: пустой файл', async () => {
    const p = tmpFile('');
    await expect(analyze({ input: p })).rejects.toThrow('Файл пуст');
    fs.unlinkSync(p);
  });

  test('ошибка: некорректный --top', async () => {
    const p = tmpFile('2026-09-01T00:00:00Z | ERROR | gateway | HTTP_502 | x');
    await expect(analyze({ input: p, top: 'abc' })).rejects.toThrow('Некорректный --top');
    fs.unlinkSync(p);
  });

  test('файл только из повреждённых строк', async () => {
    const p = tmpFile('bad\nworse\nwrong');
    const report = await analyze({ input: p, top: '5' });
    expect(report.validLines).toBe(0);
    expect(report.errorLines).toBe(3);
    fs.unlinkSync(p);
  });
});