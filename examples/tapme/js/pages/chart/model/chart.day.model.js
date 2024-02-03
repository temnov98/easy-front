/**
 * @typedef {Object} RawChartDayModel
 * @property {string} date
 * @property {RawChartTaskModel[]} tasks
 * @property {RawChartIntervalModel[]} intervals
 */

class ChartDayModel {
    /**
     * @param {Date} date
     * @param {ChartTaskModel[]} tasks
     * @param {ChartIntervalModel[]} intervals
     */
    constructor({ date, tasks, intervals }) {
        this.date = date;
        this.tasks = tasks;
        this.intervals = intervals;
    }

    /**
     * @param {RawChartDayModel} raw
     * @return {ChartDayModel}
     */
    static fromRaw(raw) {
        return new ChartDayModel({
            date: new Date(raw.date),
            tasks: (raw.tasks ?? []).map((task) => ChartTaskModel.fromRaw(task)),
            intervals: (raw.intervals ?? []).map((interval) => ChartIntervalModel.fromRaw(interval)),
        });
    }

    /**
     * @return {RawChartDayModel}
     */
    toRaw() {
        return {
            date: this.date.toISOString(),
            tasks: this.tasks.map((task) => task.toRaw()),
            intervals: this.intervals.map((interval) => interval.toRaw()),
        };
    }
}
