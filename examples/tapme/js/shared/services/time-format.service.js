class TimeFormatService {
    /**
     * @param {number} durationInSeconds
     * @returns {string}
     */
    durationFormatted(durationInSeconds) {
        if (!durationInSeconds) {
            return '';
        }

        return [
            this._getHoursFormatted(durationInSeconds),
            this._getMinutesFormatted(durationInSeconds),
            this._getSecondsFormatted(durationInSeconds),
        ].join(' ');
    }

    /**
     * @param {number} durationInSeconds
     * @returns {string}
     */
    _getHoursFormatted(durationInSeconds) {
        const hours = Math.floor(durationInSeconds / 60 / 60);

        return hours ? `${hours}h` : '';
    }

    /**
     * @param {number} durationInSeconds
     * @returns {string}
     */
    _getMinutesFormatted(durationInSeconds) {
        const minutes = Math.floor((durationInSeconds % (60 * 60)) / 60);

        return minutes ? `${minutes}m` : '';
    }

    /**
     * @param {number} durationInSeconds
     * @returns {string}
     */
    _getSecondsFormatted(durationInSeconds) {
        const seconds = Math.floor(durationInSeconds % 60);

        return seconds ? `${seconds}s` : '';
    }
}

const timeFormatService = new TimeFormatService();
