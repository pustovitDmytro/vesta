import { pause } from 'myrmidon';
import { assert } from 'chai';
import { BenchMark, JSONReporter } from '../entry';
import { checkReportItem, getReportItem } from '../utils';

suite('Benchmark reports');

test('Positive: pretty json', async function () {
    const bench = new BenchMark({});

    bench.sequence('before');
    await pause(2010);
    bench.sequence('after');

    const report = JSON.parse(
        bench.report(new JSONReporter(), { pretty: true })
    );

    checkReportItem(report, 'before', 'benchmark', 0);
    assert.match(
        getReportItem(report, 'after').benchmark,
        /2s \d+ms/
    );
});


test('Positive: pretty config', async function () {
    const bench = new BenchMark({});

    bench.sequence('before');
    await pause(120);
    bench.sequence('after');

    const report = JSON.parse(
        bench.report(new JSONReporter(), {
            pretty : {
                exclude : [ 'total' ],
                include : [ 'mean', 'benchmark' ]
            }
        })
    );

    checkReportItem(report, 'before', 'benchmark', 0);
    assert.match(
        getReportItem(report, 'after').benchmark,
        /1\d+ms/
    );
});

