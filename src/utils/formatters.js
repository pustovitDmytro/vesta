/* eslint-disable no-magic-numbers */

const timeUnits = [
    { label: 'ms', frack: 1000 },
    { label: 's', frack: 60 },
    { label: 'min', frack: 60 },
    { label: 'h', frack: 24 },
    { label: 'd', frack: 24 }
];

export function formatTime(duration, depth = 2) {
    if (!+duration) return 0;
    let s = duration;
    const values = [];

    for (const unit of timeUnits) {
        const value = s % unit.frack;

        s = (s - value) / unit.frack;
        values.push({ value, unit: unit.label });
    }

    const result = [];

    let left = depth;

    for (const { value, unit } of values.reverse()) {
        if (value > 0) result.push(`${value}${unit}`);
        if (result.length > 0 && !left--) break;
    }

    return result.join(' ');
}

const k = 1024;
const sizes = [ 'B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB' ];

export function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return 0;

    const dm = decimals < 0 ? 0 : decimals;

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}
