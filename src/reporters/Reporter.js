export default class Reporter {
    render(report) {
        return report;
    }

    merge(renderedReports) {
        return renderedReports;
    }

    run(reports, { prettify }) {
        return this.merge(
            reports.map(({ label, _meta, ...r }) => {
                const metrics = prettify ? prettify(r, _meta) : r;

                return this.render({
                    label,
                    ...metrics
                });
            })
        );
    }
}
