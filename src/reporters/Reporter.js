export default class Reporter {
    render(report) {
        return report;
    }

    merge(renderedReports) {
        return renderedReports;
    }

    run(reports, { prettify }) {
        return this.merge(
            reports.map(({ label, ...r }) => {
                const metrics = prettify
                    ? this.prettify(prettify, r)
                    : r;

                return this.render({
                    label,
                    ...metrics
                });
            })
        );
    }

    prettify(prettifier, obj) {
        const res = {};

        for (const key of Object.keys(obj)) {
            res[key] = prettifier(obj[key]);
        }

        return res;
    }
}
