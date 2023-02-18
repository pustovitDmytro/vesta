import { assert } from 'chai';
import { pause } from 'myrmidon';
import entry from '../entry';

suite('Configurations');

const BenchMark = entry;

test('Positive: default configuration', async function () {
    const bench = new BenchMark();

    await Promise.all([ 10, 20, 30, 40, 50, 60 ].map(async i => {
        const bi = bench.start('pause');

        await pause(i);
        bench.end(bi);
    }));

    const report = bench.report();

    assert.match(report, /Label: pause/);
    assert.match(report, /Total: \d+/);
    assert.match(report, /Mean: [+-]?(\d*\.)?\d+/);
    assert.match(report, /Q25: [+-]?(\d*\.)?\d+/);
    assert.match(report, /Q75: [+-]?(\d*\.)?\d+/);
});
