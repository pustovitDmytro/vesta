import Timer from './Timer';

export default class PerformanceNow extends Timer {
    bench() {
        return performance.now();
    }
}
