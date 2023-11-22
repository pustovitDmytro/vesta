/* eslint-disable no-param-reassign */
import { mean, isValue, isObject } from 'myrmidon';
import PlainReporter from './reporters/PlainReporter';

export default class BaseBenchMark {
    constructor({
        counter,
        shortSingleObservations = true
    }) {
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
        const benchmark = new this.constructor({
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
        mean  : arr => mean(arr)
    };

    static items = {};

    calculateIntervals() {
        this._labels.filter(l => l.sequence)
            .forEach((item, index, sequence) => {
                const startPoint = index === 0 ? this._start : sequence[index - 1].end;

                item.bench = this.counter.diff(startPoint, item.end);
            });

        this._labels.filter(l => !l.sequence && l.start && l.end).forEach(item => {
            item.bench = this.counter.diff(item.start, item.end);
        });
    }

    _prepareMultiObservationReport(bench, metrics, report) {
        for (const key of Object.keys(bench[0])) {
            const arr = bench.map(b => b[key]);

            report[key] = {};
            this._prepareSingleObservationReport(arr, metrics, report[key]);
        }
    }

    _prepareSingleObservationReport(bench, metrics, report) {
        const metricNames = Object.keys(metrics)
            .filter(metricName => metrics[metricName]);

        for (const metricName of metricNames) {
            report[metricName] = metrics[metricName](bench);
        }
    }

    prepareReport(label, labels, { metrics, items }) {
        const filtered = labels.filter(ll => ll.label === label && isValue(ll.bench));

        if (filtered.length === 0) return;
        const report = { label };

        const bench = filtered.map(item => item.bench);
        const multiObservation = isObject(bench[0]);

        if (filtered.length === 1 && this._config.shortSingleObservations) {
            if (multiObservation) {
                for (const key of Object.keys(bench[0])) {
                    report[key] = bench[0][key];
                }
            } else {
                report.benchmark = bench[0];
            }


            return report;
        }


        const mergedMetrics = {
            ...this.constructor.metrics,
            ...metrics
        };

        if (multiObservation) {
            this._prepareMultiObservationReport(bench, mergedMetrics, report);
        } else {
            this._prepareSingleObservationReport(bench, mergedMetrics, report);
        }

        const mergedItems = {
            ...this.constructor.items,
            ...items
        };

        for (const itemLabel of Object.keys(mergedItems)) {
            if (!mergedItems[itemLabel]) continue;
            report[itemLabel] = mergedItems[itemLabel](
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

        for (const benchmark of this._iterations) {
            for (const label of benchmark._labels) {
                labels.push(label);
            }
        }

        const labelsList = new Set(labels.map(l => l.label));

        this.calculateIntervals();
        this._iterations.forEach(b => b.calculateIntervals());

        for (const label of labelsList) {
            const report = this.prepareReport(label, labels, { metrics, items });

            if (!report) continue;
            this._reports.push(report);
        }
    }

    report(reporter = new PlainReporter(), { pretty = false } = {}) {
        this.calculate();

        return reporter.run(this._reports, {
            prettify : pretty && this.counter.constructor.prettify
        });
    }
}
