class TaskIntervalModel {
    /**
     * @param {object} params
     * @param {Date} params.startedAt
     * @param {Date} params.finishedAt
     */
    constructor({ startedAt, finishedAt }) {
        this.startedAt = startedAt;
        this.finishedAt = finishedAt;
    }

    /**
     * @returns {number}
     */
    get durationInMilliseconds() {
        return this.finishedAt  - this.startedAt;
    }
}
