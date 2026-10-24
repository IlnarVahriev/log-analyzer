'use strict';

const fs = require('fs');
const readline = require('readline');

const { parseLine } = require('./src/parser');
const { matches } = require('./src/filter');
const { createAggregator } = require('./src/agregator'); 
const { buildReport, toJSON, toCSV, toText } = require('./src/json'); 
const { parseArgs } = require('./src/cli');

async function analyze({ input, from, to, level, source, top, format, output }) {
    if (!input) throw new Error('Не указан --input (путь к файлу журнала)');
    if (!fs.existsSync(input)) throw new Error(`Файл не найден: ${input}`);
    if (fs.statSync(input).size === 0) throw new Error(`Файл пуст: ${input}`);

    const topN = top ? parseInt(top, 10) : 10;
    if (Number.isNaN(topN) || topN <= 0) {
        throw new Error(`Некорректный --top: ${top}`);
    }

    let totalLines = 0;      
    let validLines = 0;        
    const errorLines = [];     
    let matchedEvents = 0;     
    const aggregator = createAggregator();

    const stream = fs.createReadStream(input, { encoding: 'utf8' });
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

    for await (const line of rl) {
        totalLines++;
        const event = parseLine(line);
        if (!event) {
            errorLines.push(totalLines); 
            continue;                 
        }
        validLines++;
        if (matches(event, { from, to, level, source })) {
            matchedEvents++;
            aggregator.add(event);
        }
    }

    const aggregation = aggregator.result(topN);
    const report = buildReport({
        totalLines,
        validLines,
        errorLines: errorLines.length,
        matchedEvents,
        aggregation
    });

    console.log(toText(report));
    if (errorLines.length > 0) {
        console.log('');
        console.log('Номера ошибочных строк:', errorLines.join(', '));
    }

    if (output) {
        const content = format === 'csv' ? toCSV(report) : toJSON(report);
        fs.writeFileSync(output, content, 'utf8');
        console.log('');
        console.log(`Результат сохранён: ${output}`);
    }

    return report;
}

async function main() {
    try {
        const args = parseArgs(process.argv.slice(2));
        await analyze(args);
    } catch (err) {
        console.error('Ошибка:', err.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { analyze };
