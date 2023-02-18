import { NS_PER_MS } from 'myrmidon';
import Timer from './Timer';

export default class ProcessHrtime extends Timer {
    bench() {
        return process.hrtime.bigint();
    }

    diff(start, end) {
        const nsDiff = end - start;
        const msTime = nsDiff  / BigInt(NS_PER_MS);

        return Number(msTime);
    }
}
