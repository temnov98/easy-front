/**
 * @typedef {Object} RawChartDayModel
 * @property {string} date
 * @property {RawChartTaskModel[]} tasks
 */

class ChartDayModel {
    /**
     * @param {Date} date
     * @param {ChartTaskModel[]} tasks
     */
    constructor({ date, tasks }) {
        this.date = date;
        this.tasks = tasks;
    }

    /**
     * @param {RawChartDayModel} raw
     * @return {ChartDayModel}
     */
    static fromRaw(raw) {
        return new ChartDayModel({
            date: new Date(raw.date),
            tasks: raw.tasks.map((task) => ChartTaskModel.fromRaw(task))
        });
    }

    /**
     * @return {RawChartDayModel}
     */
    toRaw() {
        return {
            date: this.date.toISOString(),
            tasks: this.tasks.map((task) => task.toRaw()),
        };
    }
}
