/**
 * @typedef {RawChartDayModel[]} RawChartDaysModel
 */

class ChartStorageService {
    constructor() {
        this.chartDaysStorageKey = 'time-tracker-local-storage-key:chart:days';
        this.chartShowEmptyDaysStorageKey = 'time-tracker-local-storage-key:chart:showEmptyDays';
        this.chartModeStorageKey = 'time-tracker-local-storage-key:chart:chartMode';
    }

    /**
     * @returns {{ days: ChartDayModel[]; showEmptyDays: boolean; chartMode: string }}
     */
    load() {
        try {
            const chartMode = localStorage.getItem(this.chartModeStorageKey);
            const showEmptyDaysRaw = localStorage.getItem(this.chartShowEmptyDaysStorageKey);

            const rawString = localStorage.getItem(this.chartDaysStorageKey);
            if (!rawString) {
                console.log(`Chart local storage is empty`);

                return { days: [], showEmptyDays: false, chartMode };
            }

            /** @type {RawChartDaysModel} */
            const rawDays = JSON.parse(rawString);

            const days = rawDays.map((day) => ChartDayModel.fromRaw(day));

            console.log(`Loaded chart from local storage`);

            return {
                days,
                showEmptyDays: showEmptyDaysRaw === 'true',
                chartMode,
            };
        } catch (error) {
            console.log(`Error loading chart from local storage: ${error.message}`);

            return { days: [], showEmptyDays: false, chartMode: ChartMode.Bars };
        }
    }

    /**
     * @param {object} params
     * @param {ChartDayModel[]} params.days
     * @param {boolean} params.showEmptyDays
     * @param {string} params.chartMode
     */
    save({ days, showEmptyDays, chartMode }) {
        try {
            /** @type {RawChartDaysModel} */
            const rawDays = days.map((day) => day.toRaw());

            localStorage.setItem(this.chartDaysStorageKey, JSON.stringify(rawDays));
            localStorage.setItem(this.chartShowEmptyDaysStorageKey, JSON.stringify(showEmptyDays));
            localStorage.setItem(this.chartModeStorageKey, chartMode);
        } catch (error) {
            console.log(`Error saving chart to local storage: ${error.message}`);
        }
    }
}

const chartStorageService = new ChartStorageService();
