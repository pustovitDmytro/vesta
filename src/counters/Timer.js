import { formatTime } from '../utils/formatters';
import Counter from './Counter';

export default class Timer extends Counter {
    bench() {
        return new Date();
    }

    static prettify(data) {
        return formatTime(data);
    }

    diff(start, end) {
        return end - start;
    }
}
