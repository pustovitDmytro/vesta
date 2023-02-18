export default class Reporter {
    render(report) {
        return report;
    }

    merge(renderedReports) {
        return renderedReports;
    }

    run(reports) {
        return this.merge(
            reports.map(r => this.render(r))
        );
    }
}
