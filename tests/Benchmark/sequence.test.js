import { pause } from 'myrmidon';
import { BenchMark, JSONReporter } from '../entry';
import { checkReportItem } from '../utils';

suite('sequence');

test('Positive: one iteration', async function () {
    const bench = new BenchMark({});

    bench.sequence('before all');
    await pause(25);
    bench.sequence('25ms gone');
    await pause(15);
    bench.sequence('after 15ms more');
    await pause(50);
    bench.sequence('end of the test');

    const report = JSON.parse(bench.report(new JSONReporter()));

    checkReportItem(report, 'before all', 'benchmark', 0);
    checkReportItem(report, '25ms gone', 'benchmark', 25);
    checkReportItem(report, 'after 15ms more', 'benchmark', 15);
    checkReportItem(report, 'end of the test', 'benchmark', 50);
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
