import ProcessMemory from './counters/ProcessMemory';
import Base from './BaseBenchMark';

export default class Memory extends Base {
    constructor({
        counter = new ProcessMemory(),
        shortSingleObservations = true
    } = {}) {
        super({ counter, shortSingleObservations });
    }

    static metrics = {
        mean : Base.metrics.mean
    };

    static items = {
        total : arr => arr.length
    };
}
