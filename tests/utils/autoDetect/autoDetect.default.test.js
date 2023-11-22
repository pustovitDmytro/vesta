import { pause } from 'myrmidon';
import { assert } from 'chai';
import { load } from '../../utils';

const { default: autoDetector } = load('counters/autoDetector.js');

suite('autoDetector');

test('Positive: default export', async function () {
    assert.isFunction(autoDetector);
    const counter = autoDetector();

    const a = counter.bench();

    await pause(10);
    const b = counter.bench();

    assert.isFinite(counter.diff(a, b));
});
