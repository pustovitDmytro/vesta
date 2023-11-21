import { quantile } from 'myrmidon';
import autoDetectCounter from './counters/autoDetector';
import Base from './BaseBenchMark';

export default class BenchMark extends Base {
    constructor({
        counter = autoDetectCounter(),
        shortSingleObservations = true
    } = {}) {
        super({ counter, shortSingleObservations });
    }

    static metrics = {
        ...Base.metrics,
        q25 : arr => quantile(arr, 0.25), // eslint-disable-line no-magic-numbers
        q75 : arr => quantile(arr, 0.75) // eslint-disable-line no-magic-numbers
    };
}
