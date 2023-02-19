import { assert } from 'chai';
import { pause } from 'myrmidon';
import { BenchMark, JSONReporter } from '../entry';

suite('sequence');

const PERMISSIBLE_FAULT = 0.08;

function checkReportItem(report, label, metric, value) {
    const message = `label=${label}, metric=${metric}, value=${value}`;
    const item = report.find(r => r.label === label);

    assert.exists(item, message);
    const metricValue = item[metric];

    assert.isAtLeast(metricValue, value * (1 - PERMISSIBLE_FAULT), message);
    assert.isAtMost(metricValue, value * (1 + PERMISSIBLE_FAULT), message);
}

test('Positive: one iteration', async function () {
    const bench = new BenchMark({});

    bench.sequence('before all');
    await pause(15);
    bench.sequence('15ms gone');
    await pause(5);
    bench.sequence('after 5ms more');
    await pause(10);
    bench.sequence('end of the test');

    const report = JSON.parse(bench.report(new JSONReporter()));

    checkReportItem(report, 'before all', 'benchmark', 0);
    checkReportItem(report, '15ms gone', 'benchmark', 15);
    checkReportItem(report, 'after 5ms more', 'benchmark', 5);
    checkReportItem(report, 'end of the test', 'benchmark', 10);
});

test('Positive: several iterations', async function () {
    const bench = new BenchMark();

    bench.sequence('before cycle');

    for (const iter of [ 1, 2, 3 ]) {
        const iteration = bench.iteration(iter);

        iteration.sequence('before iteration');
        await pause(15);
        iteration.sequence('15ms gone');
        await pause(10);
        iteration.sequence('after 10ms more');
        await pause(20);
        iteration.sequence('end of the iteration');
    }

    bench.sequence('after cycle');
    console.log(bench.report(new JSONReporter()));
    const report = JSON.parse(bench.report(new JSONReporter()));

    checkReportItem(report, 'before cycle', 'benchmark', 0);
    checkReportItem(report, 'before iteration', 'mean', 0);
    checkReportItem(report, '15ms gone', 'mean', 15);
    checkReportItem(report, 'after 10ms more', 'mean', 10);
    checkReportItem(report, 'end of the iteration', 'mean', 20);
    checkReportItem(report, 'before iteration', 'total', 3);
    checkReportItem(report, 'after cycle', 'benchmark', 3 * (15 + 10 + 20));
});
