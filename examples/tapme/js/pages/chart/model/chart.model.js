class ChartModel extends BaseModel {
    constructor() {
        super();

        const { days } = chartStorageService.load();

        this._days = [];
        this._activeTags = new Set();
        this.min = 0;
        this.max = 0;

        this._setDays(days);

        this.chartData = this.createObservable(this._getChartData(), 'chartData');
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
            const days = await ChartFileReaderService.readFiles();

            this._setDays(days);
            this._updateChartData();
            this._saveToStorage();
        } catch (error) {
            modalWindowModel.openModal('ErrorModalComponent', 'Error on reading files');
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
    }

    _saveToStorage() {
        chartStorageService.save({
            days: this._days,
        });
    }
}

const chartModel = new ChartModel();
