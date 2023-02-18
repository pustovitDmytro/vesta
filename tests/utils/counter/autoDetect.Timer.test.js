import { pause } from 'myrmidon';
import { assert } from 'chai';
import { load } from '../../utils';
import { BaseTimer } from '../../entry';

const { default: autoDetector } = load('counters/autoDetector.js');

const oldProcess = process.hrtime;

suite('autoDetector: Timer');

before(async function ()  {
    process.hrtime = null;
});

test('Positive: Timer', async function () {
    const counter = autoDetector();

    assert.instanceOf(counter, BaseTimer);
    const a = counter.bench();

    await pause(10);
    const b = counter.bench();

    assert.isFinite(counter.diff(a, b));
});

after(async function ()  {
    process.hrtime = oldProcess;
});
