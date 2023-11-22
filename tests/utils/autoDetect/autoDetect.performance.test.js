import { pause } from 'myrmidon';
import { assert } from 'chai';
import { load } from '../../utils';
import { PerformanceNow } from '../../entry';

const { default: autoDetector } = load('counters/autoDetector.js');

const oldProcess = process.hrtime;

suite('autoDetector: PerformanceNow');

before(async function ()  {
    process.hrtime = null;
    global.performance = {
        now : () => new Date()
    };
});

test('Positive: PerformanceNow', async function () {
    const counter = autoDetector();

    assert.instanceOf(counter, PerformanceNow);
    const a = counter.bench();

    await pause(10);
    const b = counter.bench();

    assert.isFinite(counter.diff(a, b));
});

after(async function ()  {
    process.hrtime = oldProcess;
    global.performance = null;
});
