import Counter from './Counter';

export default class Timer extends Counter {
    bench() {
        return new Date();
    }

    diff(start, end) {
        return end - start;
    }
}
