import path from 'path';
import { assert } from 'chai';
import { entry } from './constants';

export function load(relPath, clearCache) {
    const absPath = path.resolve(entry, relPath);

    if (clearCache) delete require.cache[require.resolve(absPath)];
    // eslint-disable-next-line security/detect-non-literal-require
    const result =  require(absPath);

    if (clearCache) delete require.cache[require.resolve(absPath)];

    return result;
}

export function resolve(relPath) {
    return require.resolve(path.join(entry, relPath));
}

export const PERMISSIBLE_FAULT = 0.1;

export function getReportItem(report, label) {
    return report.find(r => r.label === label);
}


export function checkReportItem(report, label, metric, value) {
    const message = `label=${label}, metric=${metric}, value=${value}`;
    const item = getReportItem(report, label);

    assert.exists(item, message);
    const metricValue = item[metric];

    assert.isAtLeast(metricValue, value * (1 - PERMISSIBLE_FAULT), message);
    assert.isAtMost(metricValue, value * (1 + PERMISSIBLE_FAULT), message);
}
