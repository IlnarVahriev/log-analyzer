const { parseArgs } = require('../src/cli');

describe('parseArgs', () => {
  test('парсит --key value', () => {
    expect(parseArgs(['--input', 'a.log', '--top', '5']))
      .toEqual({ input: 'a.log', top: '5' });
  });

  test('флаг без значения', () => {
    expect(parseArgs(['--verbose', '--input', 'a.log']))
      .toEqual({ verbose: true, input: 'a.log' });
  });

  test('пустой массив', () => expect(parseArgs([])).toEqual({}));

  test('игнорирует позиционные аргументы', () => {
    expect(parseArgs(['foo', '--input', 'a.log']))
      .toEqual({ input: 'a.log' });
  });
});