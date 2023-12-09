/**
 * @typedef {Object} RawChartTaskModel
 * @property {string[]} tags
 * @property {number} seconds
 */

class ChartTaskModel {
    static NoTagTitle = 'No tag';

    /**
     * @param {string} tags
     * @param {number} seconds
     */
    constructor({ tags, seconds }) {
        this.tags = (tags ?? [ChartTaskModel.NoTagTitle]).sort();

        if (!this.tags.length) {
            this.tags.push(ChartTaskModel.NoTagTitle);
        }

        this.seconds = seconds;
    }

    /**
     * @param {RawChartTaskModel} raw
     * @return {ChartTaskModel}
     */
    static fromRaw(raw) {
        return new ChartTaskModel({
            tags: raw.tags,
            seconds: raw.seconds,
        });
    }

    /**
     * @return {RawChartTaskModel}
     */
    toRaw() {
        return {
            seconds: this.seconds,
            tags: this.tags,
        };
    }
}
