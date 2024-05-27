// TODO: Refactor this file.
//  1) Поля названы не самым очевидным способом.
//  2) Из-за структуры observable полей тут происходят не самые оптимальные ререндеры компонентов.

class ChartModel extends BaseModel {
    constructor() {
        super();

        const { days, showEmptyDays, chartMode } = chartStorageService.load();

        this.chartMode = this.createObservable(chartMode, 'chartMode');
        this.showEmptyDays = this.createObservable(showEmptyDays, 'showEmptyDays');

        this._days = [];
        this._activeTags = new Set();
        this.min = 0;
        this.max = 0;
        this.daysCount = this.createObservable(0, 'daysCount');

        this._setDays(days);

        this.chartData = this.createObservable(this._getChartData(), 'chartData');
    }

    /**
     * @param {boolean} showEmptyDays
     */
    setShowEmptyDays(showEmptyDays) {
        this.showEmptyDays = showEmptyDays;

        this._updateChartData();
        this._saveToStorage();
    }

    /**
     * @param {string} mode
     */
    setChartMode(mode) {
        this.chartMode = mode;

        this._saveToStorage();
    }

    setPreDefinedInterval(interval) {
        const millisecondsInDay = 24 * 60 * 60 * 1000;
        const now = Date.now();
        const currentDay = new Date().getDay();
        const currentDate = new Date().getDate();
        const currentYear = new Date().getFullYear();

        const daysAgo = (date) => (now / millisecondsInDay) - (date.getTime() / millisecondsInDay);

        /** @type {Record<string, (ChartDayModel) => boolean>} */
        const filterMapping = {
            [ChartLastInterval.All]: () => true,
            [ChartLastInterval.Today]: (day) => daysAgo(day.date) < 1,
            [ChartLastInterval.ThisWeek]: (day) => daysAgo(day.date) < 7 && day.date.getDay() <= currentDay,
            [ChartLastInterval.ThisMonth]: (day) => daysAgo(day.date) < 31 && day.date.getDate() <= currentDate,
            [ChartLastInterval.ThisYear]: (day) => daysAgo(day.date) < 365 && day.date.getFullYear() <= currentYear,
            [ChartLastInterval.Last7Days]: (day) => daysAgo(day.date) < 7,
            [ChartLastInterval.Last14Days]: (day) => daysAgo(day.date) < 14,
            [ChartLastInterval.Last30Days]: (day) => daysAgo(day.date) < 30,
            [ChartLastInterval.Last90Days]: (day) => daysAgo(day.date) < 90,
            [ChartLastInterval.Last180Days]: (day) => daysAgo(day.date) < 180,
            [ChartLastInterval.Last365Days]: (day) => daysAgo(day.date) < 365,
        };

        const filterHandler = filterMapping[interval];
        if (!filterHandler) {
            return;
        }

        const count = this._days.filter(filterHandler).length;

        this.setInterval({
            min: this.daysCount - count,
            max: this.daysCount - 1,
        });

        // TODO: this fix for rerender ChartRangeComponent. This is not okay.
        this.daysCount = this.daysCount;
    }

    /**
     * @param {ChartDayModel[]} days
     * @return {string[]}
     * @private
     */
    _getAllTags(days) {
        const allTags = days.map((day) => day.tasks.map((task) => task.tags)).flat(2);
        const uniqTags = [...new Set(allTags)];

        return uniqTags.sort();
    }

    /**
     * @param {ChartDayModel[]} days
     * @return {ChartDayModel[]}
     * @private
     */
    _getSortedDays(days) {
        return days
            .map((day) => day)
            .sort((left, right) => left.date.getTime() - right.date.getTime());
    }

    /**
     * @return {ChartDataModel}
     * @private
     */
    _getChartData() {
        const days = this._days.filter((day, index) => index >= this.min && index <= this.max);

        return new ChartDataModel({
            days,
            allTags: this._getAllTags(days),
            activeTags: this._activeTags,
        });
    }

    _updateChartData() {
        this.chartData = this._getChartData();
    }

    /**
     * @param {number} min
     * @param {number} max
     */
    setInterval({ min, max }) {
        this.min = min;
        this.max = max;

        this._updateChartData();
    }

    /**
     * @param {string} tag
     * @param {boolean} checked
     */
    toggleTag(tag, checked) {
        if (checked) {
            this._activeTags.add(tag);
        } else {
            this._activeTags.delete(tag);
        }

        this._updateChartData();
    }

    clearChart() {
        this._setDays([]);
        this._updateChartData();
        this._saveToStorage();
    }

    async selectFiles() {
        try {
            const { days, filesWithErrors } = await ChartFileReaderService.readFiles();

            this._setDays(days);
            this._updateChartData();
            this._saveToStorage();

            if (filesWithErrors.length) {
                modalWindowModel.openModal('ErrorModalComponent', {
                    message: locales.chart.errorOnReadingFiles.title,
                    items: [
                        locales.chart.errorOnReadingFiles.skippedFiles,
                        ...filesWithErrors.map((file) => `- ${file}`),
                    ],
                    okButtonTitle: locales.chart.errorOnReadingFiles.okButtonTitle,
                });
            }
        } catch (error) {
            console.log(`Error on reading files: ${error.message}`);

            modalWindowModel.openModal('ErrorModalComponent', {
                message: locales.chart.errorOnReadingFiles.title,
                okButtonTitle: locales.chart.errorOnReadingFiles.okButtonTitle,
            });
        }
    }

    /**
     * @param {ChartDayModel[]} days
     * @private
     */
    _setDays(days) {
        this._days = this._getSortedDays(days);
        this._activeTags = new Set(this._getAllTags(this._days));

        this.min = 0;
        this.max = this._days.length - 1;
        this.daysCount = this._days.length;
    }

    _saveToStorage() {
        chartStorageService.save({
            days: this._days,
            showEmptyDays: this.showEmptyDays,
            chartMode: this.chartMode,
        });
    }
}

const chartModel = new ChartModel();
