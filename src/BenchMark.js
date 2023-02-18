import { mean, quantile } from 'myrmidon';
import autoDetectCounter from './counters/autoDetector';
import PlainReporter from './reporters/PlainReporter';

export default class BenchMark {
    constructor({
        counter = autoDetectCounter(),
        shortSingleObservations = true
    } = {}) {
        this._labels = [];
        this.counter = counter;
        this._start = this.counter.bench();
        this._config = { shortSingleObservations };
        this._iterations = [];
    }

    start(label, payload) {
        const item = { start: this.counter.bench(), label };

        if (payload) item.payload = payload;
        const len = this._labels.push(item);

        return len - 1;
    }

    end(pointer) {
        this._labels[pointer].end = this.counter.bench();
    }

    iteration() {
        const benchmark = new BenchMark({
            counter : this.counter,
            ...this._config
        });

        this._iterations.push(benchmark);

        return benchmark;
    }

    sequence(label) {
        const item = { end: this.counter.bench(), label, sequence: true };

        this._labels.push(item);
    }

    static metrics = {
        total : arr => arr.length,
        mean  : arr => mean(arr),
        q25   : arr => quantile(arr, 0.25), // eslint-disable-line no-magic-numbers
        q75   : arr => quantile(arr, 0.75) // eslint-disable-line no-magic-numbers
    };

    calculateIntervals() {
        /* eslint-disable no-param-reassign */
        this._labels.filter(l => l.sequence).forEach((item, index, sequence) => {
            const startPoint = index === 0 ? this._start : sequence[index - 1].end;

            item.bench = this.counter.diff(startPoint, item.end);
        });

        this._labels.filter(l => !l.sequence && l.start && l.end).forEach(item => {
            item.bench = this.counter.diff(item.start, item.end);
        });
        /* eslint-enable no-param-reassign */
    }

    prepareReport(label, labels, { metrics, items }) {
        const filtered = labels.filter(ll => ll.label === label && ll.bench >= 0);

        if (filtered.length === 0) return;
        const report = { label };

        if (filtered.length === 1 && this._config.shortSingleObservations) {
            report.benchmark = filtered[0].bench;

            return report;
        }

        const numbers = filtered.map(item => item.bench);
        const mergedMetrics = {
            ...this.constructor.metrics,
            ...metrics
        };

        for (const metricName of Object.keys(mergedMetrics)) {
            if (!mergedMetrics[metricName]) continue;
            report[metricName] = mergedMetrics[metricName](numbers);
        }

        for (const itemLabel of Object.keys(items)) {
            if (!items[itemLabel]) continue;
            report[itemLabel] = items[itemLabel](
                filtered,
                report
            );
        }

        return report;
    }

    calculate({
        force = false,
        metrics = {},
        items = {}
    } = {}) {
        if (this._reports && !force) return this._reports;
        this._reports = [];
        const labels = [ ...this._labels ];

        this._iterations.forEach(benchmark => labels.push(...benchmark._labels));
        const labelsList = new Set(labels.map(l => l.label));

        this.calculateIntervals();
        this._iterations.forEach(b => b.calculateIntervals());

        for (const label of labelsList) {
            const report = this.prepareReport(label, labels, { metrics, items });

            if (!report) continue;
            this._reports.push(report);
        }
    }

    report(reporter = new PlainReporter()) {
        this.calculate();

        return reporter.run(this._reports);
    }
}
