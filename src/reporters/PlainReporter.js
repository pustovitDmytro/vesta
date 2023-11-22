import { inspect } from 'util';
import { isObject } from 'myrmidon';
import Reporter from './Reporter';

function capitilize(str) {
    return `${str[0].toUpperCase()}${str.slice(1)}`;
}

export default class PlainReporter extends  Reporter {
    render(report) {
        return [
            '------------------------',
            ...Object.keys(report)
                .map(key => {
                    const title = capitilize(key);
                    const payload = isObject(report[key]) ? inspect(report[key]) : report[key];

                    return `${title}: ${payload}`;
                })
        ].join('\n');
    }

    merge(renderedReports) {
        return renderedReports.join('\n');
    }
}
