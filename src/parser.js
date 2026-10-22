const Levels = ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR'];
const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

function Timestamp(value) {
    if (typeof value !== 'string') return false; 
    if (!dateFormat.test(value)) return false;

    const date = new Date(value);
    
    return !isNaN(date.getTime());
}

function parseLine(line) {
    if (typeof line !== 'string') return null;

    const trim = line.trim();
    if (trim.length === 0) return null;

    const parts = trim.split('|').map((p) => p.trim());
    if (parts.length !== 5) return null;

    const timestamp = parts[0];
    const level = parts[1];
    const source = parts[2];
    const eventCode = parts[3];
    const message = parts[4];

    const Timestamp1 = Timestamp(timestamp);
    if (Timestamp1 === false) {
        return null;
    }

    const Levels1 = Levels.includes(level);
    if (Levels1 === false) {
        return null;
    }

    if (source.length === 0) return null;
    if (eventCode.length === 0) return null;
    if (message.length === 0) return null;

    return { timestamp, level, source, eventCode, message };
}

module.exports = { parseLine, Timestamp, Levels };