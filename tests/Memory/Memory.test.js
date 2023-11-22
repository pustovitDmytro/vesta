import { assert } from 'chai';
import { Memory, JSONReporter, PlainReporter } from '../entry';
import { getReportItem, PERMISSIBLE_FAULT } from '../utils';

suite('Memory');

test('Positive: sequences on iterations', async function () {
    const bench = new Memory();

    bench.sequence('before cycle');

    for (const iter of [ 1, 2, 3 ]) {
        const iteration = bench.iteration(iter);

        iteration.sequence('before allocation');
        let a = Array.from({ length: 1e7 });

        iteration.sequence(`allocated ${a.length} array`);
        a = null;
        iteration.sequence('cleared');
    }

    bench.sequence('after cycle');
    console.log(bench.report(new JSONReporter()));
    const report = JSON.parse(bench.report(new JSONReporter()));

    assert.isAtMost(
        getReportItem(report, 'before allocation').heapUsed.mean,
        10_000
    );
    assert.isAtLeast(
        getReportItem(report, 'allocated 10000000 array').heapUsed.mean,
        25_000_000 * (1 - PERMISSIBLE_FAULT)
    );
    assert.isAtLeast(
        getReportItem(report, 'after cycle').rss,
        25_000_000 * (1 - PERMISSIBLE_FAULT)
    );
});


test('Positive: pretty labels', async function () {
    const bench = new Memory();

    const b1 = bench.start('before');

    const a = Array.from({ length: 10 });

    assert.lengthOf(a, 10);

    bench.end(b1);

    for (const iter of [ 1, 2, 3 ]) {
        const iteration = bench.iteration(iter);

        iteration.sequence('iterated');
    }

    const pretty = bench.report(new PlainReporter(), { pretty: true });

    assert.include(pretty, 'mean: 0');
    assert.notInclude(pretty, 'NaN');
    assert.match(pretty, /Total: 3$/m);

    assert.notInclude(
        bench.report(new PlainReporter(), { pretty: false }),
        '[object Object]'
    );
});
