
export default class Timer {
    bench() {
        return new Date();
    }

    diff(start, end) {
        return end - start;
    }
}
