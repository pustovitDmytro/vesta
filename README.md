![Logo](.docs/logo_250.png "vesta")
# vesta
Simplify time measurements.

[![Version][badge-vers]][npm]
[![Bundle size][npm-size-badge]][npm-size-url]
[![Downloads][npm-downloads-badge]][npm]

[![CodeFactor][codefactor-badge]][codefactor-url]
[![SonarCloud][sonarcloud-badge]][sonarcloud-url]
[![Codacy][codacy-badge]][codacy-url]
[![Scrutinizer][scrutinizer-badge]][scrutinizer-url]

[![Dependencies][badge-deps]][npm]
[![Security][snyk-badge]][snyk-url]
[![Build Status][tests-badge]][tests-url]
[![Coverage Status][badge-coverage]][url-coverage]

[![Commit activity][commit-activity-badge]][github]
[![FOSSA][fossa-badge]][fossa-url]
[![License][badge-lic]][github]
[![Made in Ukraine][ukr-badge]][ukr-link]

## 🇺🇦 Help Ukraine
I woke up on my 26th birthday at 5 am from the blows of russian missiles. They attacked the city of Kyiv, where I live, as well as the cities in which my family and friends live. Now my country is a war zone. 

We fight for democratic values, freedom, for our future! Once again Ukrainians have to stand against evil, terror, against genocide. The outcome of this war will determine what path human history is taking from now on.

💛💙  Help Ukraine! We need your support! There are [dozen ways][ukr-link] to help us, just do it!

## Table of Contents
- [vesta](#vesta)
  - [🇺🇦 Help Ukraine](#-help-ukraine)
  - [Table of Contents](#table-of-contents)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Minimal Configuration](#minimal-configuration)
    - [Sequences](#sequences)
    - [Timers](#timers)
    - [Reports](#reports)
    - [Customization](#customization)
      - [Custom mertics](#custom-mertics)
    - [Memory](#memory)
  - [Contribute](#contribute)

## Requirements
[![Platform Status][node-ver-test-badge]][node-ver-test-url]

To use library you need to have [node](https://nodejs.org) and [npm](https://www.npmjs.com) installed in your machine:

* node `>=10`
* npm `>=6`

Package is [continuously tested][node-ver-test-url] on darwin, linux and win32 platforms. All active and maintenance [LTS](https://nodejs.org/en/about/releases/) node releases are supported.

## Installation

To install the library run the following command

```bash
  npm i --save vesta
```

## Usage


### Minimal Configuration
```javascript
import BenchMark from 'vesta';

const bench = new BenchMark();

await Promise.all([ 10, 20, 30, 40, 50, 60 ].map(async i => {
    const bi = bench.start('pause');

    await pause(i);
    bench.end(bi);
}));

console.log(bench.report());
// ------------------------
// Label: pause
// Total: 6
// Mean: 35.166666666666664
// Q25: 22.75
// Q75: 47.5

```

### Sequences

in case of consecutive measurements use next api:

```javascript
import BenchMark, { JSONReporter } from 'vesta';

const bench = new BenchMark();

bench.sequence('before cycle');

for (const iter of [ 1, 2, 3 ]) {
    const iteration = bench.iteration(iter);

    iteration.sequence('before iteration');
    await pause(15);
    iteration.sequence('15ms gone');
    await pause(10);
    iteration.sequence('after 10ms more');
    await pause(20);
    iteration.sequence('end of the iteration');
}

bench.sequence('after cycle');

console.log(bench.report(new JSONReporter()));
// [{"label":"before cycle","benchmark":0},{"label":"after cycle","benchmark":139},{"label":"before iteration","total":3,"mean":0,"q25":0,"q75":0},{"label":"15ms gone","total":3,"mean":15.333333333333334,"q25":15,"q75":15.5},{"label":"after 10ms more","total":3,"mean":10,"q25":10,"q75":10},{"label":"end of the iteration","total":3,"mean":20,"q25":20,"q75":20}]
```


### Timers
Timers are used to fix the moment of time.
By default Timer is autodetected among  `process.hrtime.bigint()` `performance.now()` or `new Date()` depending on your environment.

All timers available from package:
```javascript
import { Timer, ProcessHrtime, PerformanceNow } from 'vesta';
```

you can pass any of them explicitly:
```javascript
import { Timer } from 'vesta';

class customTimer extends Timer {}

const bench = new BenchMark({
    counter : new customTimer()
});

```

to implement own timer it is recomended to  extends `Timer` and follow it's interfece.

### Reports

There are two reports available:
  * `JSONReporter` - report in json format, usefull for external export.
  * `PlainReporter` - used by default.

use custom reporter on report generation:
```javascript

import BenchMark, { JSONReporter } from 'vesta';

const bench = new BenchMark();

const report = JSON.parse(bench.report(new JSONReporter()));

```

to pretty print numbers in report use:
```javascript
import BenchMark, { PlainReporter } from 'vesta';

const bench = new BenchMark();

bench.report(new PlainReporter(), { pretty: true });
```

or pass `pretty` as configuration object:

```javascript
import BenchMark, { JSONReporter } from 'vesta';

const bench = new BenchMark({});

bench.sequence('before');
await pause(2500);
bench.sequence('after');

console.log(
    bench.report(new JSONReporter(), {
        pretty : {
            exclude : [ 'total' ],
            include : [ 'mean', 'benchmark' ]
        }
    })
);

// [
//     { label: 'before', benchmark: 0 },
//     { label: 'after', benchmark: '2s 504ms' }
// ];

```
where
 * `include` - array with metric names, for which prettifier will be added.
 * `exclude` - array with metric names, for which prettifier won't be added.

### Customization

pass next options to BenchMark properties:

* `shortSingleObservations` (boolean): use short report when there are only 1 observation. `true` by default.
* `counter` (Timer): time measurer. autodetector by default.


#### Custom mertics

To enrich your reports, you can easily introduce new metrics to the benchmark calculations in your JavaScript code. Utilize the `calculate()` method along with `metrics` and `items` objects within the BenchMark instance:

```javascript
import BenchMark from 'vesta';

const bench = new BenchMark({});

bench.calculate({
    metrics : {
        over25ms : arr => arr.filter(i => i > 25).length, // number of benchmarks longer then 25ms,

        // Omit calculation for quantiles
        q25 : null,
        q75 : null
    },
    items : {
        // Identify benchmarks over the mean value
        overMean : (arr, metrics) => arr.filter(i => i.bench > metrics.mean).map(i => i.payload)
    }
});
```

  Some of the other custom metrics you might be looking for:

  * include a metric for the mean value over the last 10 records exclusively:
  ```javascript
  metrics : {
      last10 : arr => BenchMark.metrics.mean(arr.slice(-10));
  }
  ```

These additions allow you to tailor the benchmarks and generate more comprehensive reports tailored to your specific needs.



### Memory

Use the same API to benchmark memory usage:

```javascript
import { Memory, PlainReporter } from 'vesta';

const bench = new Memory();

const b1 = bench.start('before');
const a = Array.from({ length: 1e7 });

bench.end(b1);

console.log(bench.report(new PlainReporter(), { pretty: true }));

//   ------------------------
// Label: before
// Rss: 76.05MB
// HeapTotal: 76.3MB
// HeapUsed: 76.29MB
// External: 0MB
// ArrayBuffers: 0MB
```

## Contribute

Make the changes to the code and tests. Then commit to your branch. Be sure to follow the commit message conventions. Read [Contributing Guidelines](.github/CONTRIBUTING.md) for details.

[npm]: https://www.npmjs.com/package/vesta
[github]: https://github.com/pustovitDmytro/vesta
[coveralls]: https://coveralls.io/github/pustovitDmytro/vesta?branch=master
[badge-deps]: https://img.shields.io/librariesio/release/npm/vesta.svg
[badge-vers]: https://img.shields.io/npm/v/vesta.svg
[badge-lic]: https://img.shields.io/github/license/pustovitDmytro/vesta.svg
[badge-coverage]: https://coveralls.io/repos/github/pustovitDmytro/vesta/badge.svg?branch=master
[url-coverage]: https://coveralls.io/github/pustovitDmytro/vesta?branch=master

[snyk-badge]: https://snyk-widget.herokuapp.com/badge/npm/vesta/badge.svg
[snyk-url]: https://snyk.io/advisor/npm-package/vesta

[tests-badge]: https://img.shields.io/circleci/build/github/pustovitDmytro/vesta
[tests-url]: https://app.circleci.com/pipelines/github/pustovitDmytro/vesta

[codefactor-badge]: https://www.codefactor.io/repository/github/pustovitdmytro/vesta/badge
[codefactor-url]: https://www.codefactor.io/repository/github/pustovitdmytro/vesta

[commit-activity-badge]: https://img.shields.io/github/commit-activity/m/pustovitDmytro/vesta

[scrutinizer-badge]: https://scrutinizer-ci.com/g/pustovitDmytro/vesta/badges/quality-score.png?b=master
[scrutinizer-url]: https://scrutinizer-ci.com/g/pustovitDmytro/vesta/?branch=master

[codacy-badge]: https://app.codacy.com/project/badge/Grade/8667aa23afaa4725854f098c4b5e8890
[codacy-url]: https://www.codacy.com/gh/pustovitDmytro/vesta/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=pustovitDmytro/vesta&amp;utm_campaign=Badge_Grade

[sonarcloud-badge]: https://sonarcloud.io/api/project_badges/measure?project=pustovitDmytro_vesta&metric=alert_status
[sonarcloud-url]: https://sonarcloud.io/dashboard?id=pustovitDmytro_vesta

[npm-downloads-badge]: https://img.shields.io/npm/dw/vesta
[npm-size-badge]: https://img.shields.io/bundlephobia/min/vesta
[npm-size-url]: https://bundlephobia.com/result?p=vesta

[node-ver-test-badge]: https://github.com/pustovitDmytro/vesta/actions/workflows/npt.yml/badge.svg?branch=master
[node-ver-test-url]: https://github.com/pustovitDmytro/vesta/actions?query=workflow%3A%22Node.js+versions%22

[fossa-badge]: https://app.fossa.com/api/projects/custom%2B24828%2Fvesta.svg?type=shield
[fossa-url]: https://app.fossa.com/projects/custom%2B24828%2Fvesta?ref=badge_shield

[ukr-badge]: https://img.shields.io/badge/made_in-ukraine-ffd700.svg?labelColor=0057b7
[ukr-link]: https://war.ukraine.ua