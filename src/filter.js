function matches(event, filters = {}) {
    const from = filters.from;
    const to = filters.to;
    const level = filters.level;
    const source = filters.source;

    if (from && event.timestamp < from) return false;
    if (to && event.timestamp >= to) return false;
    if (level && event.level !== level) return false;
    if (source && event.source !== source) return false;

    return true;
}

module.exports = { matches };