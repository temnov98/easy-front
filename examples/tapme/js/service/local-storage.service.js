/**
 * @typedef {Object} RawValue
 * @property {Array<{ id: number; title: string; durationInSeconds: number; startedAt?: string }>} tasks
 * @property {Array<{ id: number; title: string }>} presets
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
        return localStorage.getItem(this.storageKey + '-' +key);
    }

    /**
     * @param {string} key
     * @param {string} value
     */
    setItem(key, value) {
        localStorage.setItem(this.storageKey + '-' +key, value);
    }
}

const localStorageService = new LocalStorageService();
