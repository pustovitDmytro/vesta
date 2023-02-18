import Reporter from './Reporter';

function capitilize(str) {
    return `${str[0].toUpperCase()}${str.slice(1)}`;
}

export default class PlainReporter extends  Reporter {
    render(report) {
        return [
            '------------------------',
            ...Object.keys(report)
                .map(key => `${capitilize(key)}: ${report[key]}`)
        ].join('\n');
    }

    merge(renderedReports) {
        return renderedReports.join('\n');
    }
}
