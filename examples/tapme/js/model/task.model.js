class TaskModel {
    /**
     * @param {object} params
     * @param {string} [params.id]
     * @param {string} params.title
     * @param {number} [params.durationInSeconds]
     * @param {Date} [params.startedAt]
     */
    constructor({ id, title, durationInSeconds, startedAt }) {
        this.id = id ?? getId();
        this.title = title;
        this._durationInSeconds = durationInSeconds ?? 0;
        this._startedAt = new ObservableValue(startedAt);
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

    getHoursFormatted() {
        const hours = Math.floor(this.durationInSeconds / 60 / 60);

        return hours ? `${hours}h` : '';
    }

    getMinutesFormatted() {
        const minutes = Math.floor((this.durationInSeconds % (60 * 60)) / 60);

        return minutes ? `${minutes}m` : '';
    }

    getSecondsFormatted() {
        const seconds = this.durationInSeconds % 60;

        return seconds ? `${seconds}s` : '';
    }

    get durationInSeconds() {
        return this._durationInSeconds + this._additionalDurationInSeconds;
    }

    /**
     * @returns {string}
     */
    get durationFormatted() {
        if (!this.durationInSeconds) {
            return '';
        }

        return [
            this.getHoursFormatted(),
            this.getMinutesFormatted(),
            this.getSecondsFormatted(),
        ].join(' ');
    }

    get isActive() {
        return !!this._startedAt.value;
    }

    stop() {
        if (this._startedAt.value) {
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
}
