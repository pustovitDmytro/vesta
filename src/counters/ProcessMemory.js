import { formatBytes } from '../utils/formatters';
import Counter from './Counter';

function safeGetKey(report, key) {
    return report[key] || 0;
}

export default class ProcessMemoryCountrer extends Counter {
    bench() {
        return process.memoryUsage();
    }

    static prettify(data) {
        return formatBytes(data);
    }

    diff(start, end) {
        const res = {};
        const keys = new Set([
            ...Object.keys(start),
            ...Object.keys(end)
        ]);

        keys.forEach(key => {
            res[key] = safeGetKey(end, key) - safeGetKey(start, key);
        });

        return res;
    }
}
