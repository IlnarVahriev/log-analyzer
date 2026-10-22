function parseArgs(argv) {
    const args = {};
    for (let i = 0; i < argv.length; i++) {
        const token = argv[i];
        
        if (token.startsWith('--') === false) {
        } else {
            const key = token.slice(2);
            const next = argv[i + 1];
      
            if (next === undefined || next.startsWith('--')) {
                args[key] = true;
            } else {
                args[key] = next;
                i = i + 1;
            }
        }
    }
    return args;
}

module.exports = { parseArgs };