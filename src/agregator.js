function inc(map, key) {
    map.set(key, (map.get(key) || 0) + 1);
}

function sortedEntries(map) {
    return [...map.entries()].sort((a, b) => {
        if (b[1] !== a[1]) return b[1] - a[1];
        return a[0].localeCompare(b[0]);
    });
}

function createAggregator() {
    const byLevel = new Map();
    const bySource = new Map();
    const byCode = new Map();

    return {
        add(event) {
            inc(byLevel, event.level);
            inc(bySource, event.source);
            inc(byCode, event.eventCode);
        },

        result(topN = 10) {
            return {
                byLevel: sortedEntries(byLevel),
                bySource: sortedEntries(bySource),
                topCodes: sortedEntries(byCode).slice(0, topN)
            };
        }
    };
}

module.exports = { createAggregator, sortedEntries };