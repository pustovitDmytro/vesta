/* eslint-disable unicorn/filename-case */
import Reporter from './Reporter';

export default class JSONReporter extends  Reporter  {
    merge(renderedReports) {
        return JSON.stringify(renderedReports);
    }
}
