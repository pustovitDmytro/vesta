/* eslint-disable security/detect-non-literal-require */
import { entry } from './constants';

const m = require(entry);

export default m.default;

const {
    BaseTimer,
    PerformanceNow,
    ProcessHrtime,
    BenchMark,
    PlainReporter,
    JSONReporter,
    BaseReporter
} = m;

export {
    BaseTimer,
    PerformanceNow,
    ProcessHrtime,
    BenchMark,
    PlainReporter,
    JSONReporter,
    BaseReporter
};
