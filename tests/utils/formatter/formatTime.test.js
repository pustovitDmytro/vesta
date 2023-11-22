import { assert } from 'chai';
import { load } from '../../utils';

const { formatTime } = load('utils/formatters.js');

suite('formatTime');

test('Positive: formatTime', async function () {
    const day = 86_400_000;

    assert.equal(
        formatTime(10 * 1000 + 5),
        '10s 5ms'
    );
    assert.equal(
        formatTime(2 * 60 * 60 * 1000 + 5 * 1000, 3),
        '2h 5s'
    );

    assert.equal(
        formatTime(1 * 60 * 60 * 1000 + 10 * 60 * 1000 + 5 * 1000, 3),
        '1h 10min 5s'
    );

    assert.equal(
        formatTime(7 * day + 12, 3),
        '7d'
    );

    assert.equal(
        formatTime(7 * day + 12, 4),
        '7d 12ms'
    );
});
