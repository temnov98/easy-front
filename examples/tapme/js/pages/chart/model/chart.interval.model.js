/**
 * @typedef {Object} RawChartIntervalModel
 * @property {string} title
 * @property {string} start
 * @property {string} end
 * @property {string[]} tags
 */

class ChartIntervalModel {
    /**
     * @param {string} title
     * @param {Date} start
     * @param {Date} end
     * @param {string[]} tags
     */
    constructor({ title, start, end, tags }) {
        this.title = title;
        this.start = start;
        this.end = end;
        this.tags = tags;
    }

    get percentOfDay() {
        const duration = this.end.getTime() - this.start.getTime();
        const dayDuration = 24 * 60 * 60 * 1000;

        return (duration / dayDuration) * 100;
    }

    /**
     * @param {RawChartIntervalModel} raw
     * @return {ChartIntervalModel}
     */
    static fromRaw(raw) {
        return new ChartIntervalModel({
            title: raw.title,
            start: new Date(raw.start),
            end: new Date(raw.end),
            tags: raw.tags,
        });
    }

    /**
     * @return {RawChartIntervalModel}
     */
    toRaw() {
        return {
            title: this.title,
            start: this.start.toISOString(),
            end: this.end.toISOString(),
            tags: this.tags,
        };
    }
}
