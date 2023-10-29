/**
 * @typedef {Object} RawTaskIntervalValue
 * @property {string} startedAt
 * @property {string} finishedAt
 */

/**
 * @typedef {Object} RawTaskValue
 * @property {string} id
 * @property {string} title
 * @property {number} durationInSeconds
 * @property {string} [startedAt]
 * @property {RawTaskIntervalValue[]} [finishedIntervals]
 */

/**
 * @typedef {Object} RawValue
 * @property {Array<RawTaskValue>} tasks
 * @property {Array<{ id: string; title: string }>} presets
 */

class LocalStorageService {
    constructor() {
        this.storageKey = 'time-tracker-local-storage-key';
    }

    /**
     * @returns {{ tasks: TaskModel[]; presets: PresetModel[] }}
     */
    load() {
        try {
            const rawString = localStorage.getItem(this.storageKey);
            if (!rawString) {
                console.log(`Local storage is empty`);

                return { tasks: [], presets: [] };
            }

            /** @type {RawValue} **/
            const raw = JSON.parse(rawString);

            /** @type {{ tasks: TaskModel[]; presets: PresetModel[] }} **/
            const result = {
                tasks: raw.tasks.map((task) => new TaskModel({
                    id: task.id,
                    title: task.title,
                    durationInSeconds: task.durationInSeconds,
                    startedAt: task.startedAt ? new Date(task.startedAt) : undefined,
                    finishedIntervals: this._getFinishedIntervals(task),
                })),
                presets: raw.presets.map((preset) => new PresetModel({
                    id: preset.id,
                    title: preset.title,
                })),
            };

            console.log(`Loaded from local storage`);

            return result;
        } catch (error) {
            console.log(`Error loading from local storage: ${error.message}`);
        }
    }

    /**
     * @param {RawTaskValue} task
     * @returns {TaskIntervalModel[]}
     */
    _getFinishedIntervals(task) {
        if (task.finishedIntervals) {
            return task.finishedIntervals.map((interval) => new TaskIntervalModel({
                startedAt: new Date(interval.startedAt),
                finishedAt: new Date(interval.finishedAt),
            }));
        }

        // If old version without finishedIntervals in localstorage
        return [];
    }

    /**
     * @param {Object} params
     * @param {TaskModel[]} params.tasks
     * @param {PresetModel[]} params.presets
     */
    save({ tasks, presets }) {
        try {
            /** @type {RawValue} */
            const raw = {
                tasks: tasks.map((task) => ({
                    id: task.id,
                    title: task.title,
                    durationInSeconds: task._durationInSeconds,
                    startedAt: task._startedAt.value ? task._startedAt.value.toString() : undefined,
                    finishedIntervals: task._finishedIntervals.map((interval) => ({
                        startedAt: interval.startedAt.toISOString(),
                        finishedAt: interval.finishedAt.toISOString(),
                    })),
                })),
                presets: presets.map((preset) => ({
                    id: preset.id,
                    title: preset.title,
                })),
            };

            const rawString = JSON.stringify(raw);

            localStorage.setItem(this.storageKey, rawString);

            console.log(`Saved to local storage at ${new Date().toLocaleString()}`);
        } catch (error) {
            console.log(`Error saving to local storage: ${error.message}`);
        }
    }

    /**
     * @param {string} key
     */
    getItem(key) {
        return localStorage.getItem(this.storageKey + '-' + key);
    }

    /**
     * @param {string} key
     * @param {string} value
     */
    setItem(key, value) {
        localStorage.setItem(this.storageKey + '-' + key, value);
    }
}

const localStorageService = new LocalStorageService();
