/** @class TaskModel
 * @property {string} id
 * @property {string} title
 * @property {number} _durationInSeconds
 * @property {ObservableValue} _startedAt
 * @property {TaskIntervalModel} _finishedIntervals
 */
class TaskModel {
    /**
     * @param {object} params
     * @param {string} [params.id]
     * @param {string} params.title
     * @param {number} [params.durationInSeconds]
     * @param {Date} [params.startedAt]
     * @param {TaskIntervalModel[]} [params.finishedIntervals]
     */
    constructor({ id, title, durationInSeconds, startedAt, finishedIntervals }) {
        this.id = id ?? getId();
        this.title = title;
        this._durationInSeconds = durationInSeconds ?? 0;
        this._startedAt = new ObservableValue(startedAt);
        this._finishedIntervals = finishedIntervals ?? [];
    }

    /**
     * @param {Subscriber} subscriber
     * @returns {void}
     */
    connect(subscriber) {
        this._startedAt.connect(subscriber);
    }

    /**
     * @param {Subscriber} subscriber
     * @returns {void}
     */
    disconnect(subscriber) {
        this._startedAt.disconnect(subscriber);
    }

    get _additionalDurationInSeconds() {
        return this._startedAt.value ? Math.floor((Date.now() - this._startedAt.value.getTime()) / 1000) : 0;
    }

    get durationInSeconds() {
        return this._durationInSeconds + this._additionalDurationInSeconds;
    }

    get durationInMilliseconds() {
        const durationInSeconds = this._finishedIntervals.reduce((result, interval) => result + interval.durationInMilliseconds, 0);

        return durationInSeconds + this._additionalDurationInSeconds * 1000;
    }

    /**
     * @returns {string}
     */
    get durationFormatted() {
        return timeFormatService.durationFormatted(this.durationInSeconds);
    }

    get isActive() {
        return !!this._startedAt.value;
    }

    stop() {
        if (this._startedAt.value) {
            const interval = new TaskIntervalModel({
                startedAt: this._startedAt.value,
                finishedAt: new Date(),
            });

            this._finishedIntervals.push(interval);

            this._durationInSeconds += this._additionalDurationInSeconds;

            this._startedAt.value = undefined;
        }
    }

    toggle() {
        if (this._startedAt.value) {
            this.stop();
        } else {
            this._startedAt.value = new Date();
        }
    }

    /**
     * @returns {TaskIntervalModel[]}
     */
    get intervals() {
        if (this._startedAt.value) {
            const lastInterval = new TaskIntervalModel({
                startedAt: this._startedAt.value,
                finishedAt: new Date(),
            });

            return [...this._finishedIntervals, lastInterval];
        } else {
            return this._finishedIntervals;
        }
    }
}
