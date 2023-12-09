/**
 * @typedef {RawChartDayModel[]} RawChartDaysModel
 */

class ChartStorageService {
    constructor() {
        this.chartDaysStorageKey = 'time-tracker-local-storage-key:chart:days';
    }

    /**
     * @returns {{ days: ChartDayModel[] }}
     */
    load() {
        try {
            const rawString = localStorage.getItem(this.chartDaysStorageKey);
            if (!rawString) {
                console.log(`Chart local storage is empty`);

                return { days: [] };
            }

            /** @type {RawChartDaysModel} */
            const rawDays = JSON.parse(rawString);

            const days = rawDays.map((day) => ChartDayModel.fromRaw(day));

            console.log(`Loaded chart from local storage`);

            return { days };
        } catch (error) {
            console.log(`Error loading chart from local storage: ${error.message}`);

            return { days: [] };
        }
    }

    /**
     * @param {object} params
     * @param {ChartDayModel[]} params.days
     */
    save({ days }) {
        try {
            /** @type {RawChartDaysModel} */
            const rawDays = days.map((day) => day.toRaw());

            localStorage.setItem(this.chartDaysStorageKey, JSON.stringify(rawDays));
        } catch (error) {
            console.log(`Error saving chart to local storage: ${error.message}`);
        }
    }
}

const chartStorageService = new ChartStorageService();
