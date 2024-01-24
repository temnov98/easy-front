/** @class TaskModel
 * @property {string} id
 * @property {string} title
 * @property {number} _durationInSeconds
 * @property {ObservableValue} _startedAt
 * @property {TaskIntervalModel} _finishedIntervals
 */
class TaskModel extends BaseModel {
    /**
     * @param {object} params
     * @param {string} [params.id]
     * @param {string} params.title
     * @param {number} [params.durationInSeconds]
     * @param {Date} [params.startedAt]
     * @param {TaskIntervalModel[]} [params.finishedIntervals]
     * @param {TagModel[]} [params.tags]
     */
    constructor({ id, title, durationInSeconds, startedAt, finishedIntervals, tags }) {
        super();

        this.id = id ?? getId();
        this.title = title;
        this._durationInSeconds = durationInSeconds ?? 0;
        this._startedAt = this.createObservable(startedAt, '_startedAt');
        this._finishedIntervals = finishedIntervals ?? [];
        this.tags = this.createObservable(tags ?? [], 'tags');
    }

    get _additionalDurationInSeconds() {
        return this._startedAt ? Math.floor((Date.now() - this._startedAt.getTime()) / 1000) : 0;
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

    /**
     * @returns {Date | undefined}
     */
    get firstTouch() {
        if (this._finishedIntervals.length > 0) {
            return this._finishedIntervals[0].startedAt;
        } else {
            return this._startedAt;
        }
    }

    get isActive() {
        return !!this._startedAt;
    }

    stop() {
        if (this._startedAt) {
            const interval = new TaskIntervalModel({
                startedAt: this._startedAt,
                finishedAt: new Date(),
            });

            this._finishedIntervals.push(interval);

            this._durationInSeconds += this._additionalDurationInSeconds;

            this._startedAt = undefined;
        }
    }

    toggle() {
        if (this._startedAt) {
            this.stop();
        } else {
            this._startedAt = new Date();
        }
    }

    /**
     * @returns {TaskIntervalModel[]}
     */
    get intervals() {
        if (this._startedAt) {
            const lastInterval = new TaskIntervalModel({
                startedAt: this._startedAt,
                finishedAt: new Date(),
            });

            return [...this._finishedIntervals, lastInterval];
        } else {
            return this._finishedIntervals;
        }
    }
}
