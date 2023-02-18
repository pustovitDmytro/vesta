import { isFunction } from 'myrmidon';
import ProcessHrtime from './ProcessHrtime';
import PerformanceNow from './PerformanceNow';
import Timer from './Timer';

export default function autoDetect() {
    const useProcess = (typeof process !== 'undefined') && isFunction(process?.hrtime?.bigint);

    if (useProcess) return new ProcessHrtime();
    const usePerformance = (typeof performance !== 'undefined') && isFunction(performance?.now);

    if (usePerformance) return new PerformanceNow();

    return new Timer();
}
