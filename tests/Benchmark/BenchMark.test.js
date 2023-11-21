import { assert } from 'chai';
import { pause } from 'myrmidon';
import { BenchMark, JSONReporter } from '../entry';

suite('BenchMark');

test('Positive: custom calculate', async function () {
    const bench = new BenchMark({});

    await Promise.all([ 10, 15, 30 ].map(async i => {
        const bi = bench.start('pause_iteration', `item_${i}`);

        await pause(i);
        bench.end(bi);
    }));

    bench.calculate({
        metrics : {
            over25ms : arr => arr.filter(i => i > 25).length, // number of benchmarks longer then 25ms,

            // dont calculate quantiles
            q25 : null,
            q75 : null
        },
        items : {
            overMean : (arr, metrics) => arr.filter(i => i.bench > metrics.mean).map(i => i.payload)
        }
    });

    const report = JSON.parse(bench.report(new JSONReporter()));

    assert.deepOwnInclude(report[0], {
        'label'    : 'pause_iteration',
        'total'    : 3,
        'over25ms' : 1,
        'overMean' : [ 'item_30' ]
    });
});
