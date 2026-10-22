function buildReport({ totalLines, validLines, errorLines, matchedEvents, aggregation }) {
    return {
        totalLines,
        validLines,
        errorLines,
        matchedEvents,
        byLevel: Object.fromEntries(aggregation.byLevel),
        bySource: Object.fromEntries(aggregation.bySource),
        topCodes: aggregation.topCodes.map(([code, count]) => ({ code, count }))
    };
}

function toJSON(report) {
    return JSON.stringify(report, null, 2);
}

function toCSV(report) {
    const lines = ['section,key,value'];
    lines.push(`summary,totalLines,${report.totalLines}`);
    lines.push(`summary,validLines,${report.validLines}`);
    lines.push(`summary,errorLines,${report.errorLines}`);
    lines.push(`summary,matchedEvents,${report.matchedEvents}`);
    for (const [k, v] of Object.entries(report.byLevel)) lines.push(`byLevel,${k},${v}`);
    for (const [k, v] of Object.entries(report.bySource)) lines.push(`bySource,${k},${v}`);
    for (const { code, count } of report.topCodes) lines.push(`topCodes,${code},${count}`);
    return lines.join('\n');
}

function toText(report) {
    const out = [];
    out.push('=== Сводка ===');
    out.push(`Всего строк: ${report.totalLines}`);
    out.push(`Корректных: ${report.validLines}`);
    out.push(`Ошибочных: ${report.errorLines}`);
    out.push(`Событий после фильтрации: ${report.matchedEvents}`);
    out.push('');
    out.push('По уровням:');
    for (const [k, v] of Object.entries(report.byLevel)) out.push(`  ${k}: ${v}`);
    out.push('');
    out.push('По источникам:');
    for (const [k, v] of Object.entries(report.bySource)) out.push(`  ${k}: ${v}`);
    out.push('');
    out.push('Top кодов:');
    for (const { code, count } of report.topCodes) out.push(`  ${code}: ${count}`);
    return out.join('\n');
}

module.exports = { buildReport, toJSON, toCSV, toText };