/**
 * @typedef {Object} RawTaskIntervalValue
 * @property {string} startedAt
 * @property {string} finishedAt
 */

/**
 * @typedef {Object} RawTagValue
 * @property {string} title
 * @property {string} color
 */

/**
 * @typedef {Object} RawTaskValue
 * @property {string} id
 * @property {string} title
 * @property {number} durationInSeconds
 * @property {string} [startedAt]
 * @property {RawTaskIntervalValue[]} [finishedIntervals]
 * @property {RawTagValue[]} [tags]
 */

/**
 * @typedef {Object} RawValue
 * @property {Array<RawTaskValue>} tasks
 * @property {Array<{ id: string; title: string; tags?: RawTagValue[] }>} presets
 * @property {Array<RawTagValue>} tags
 */

class TrackerLocalStorageService {
    constructor() {
        this.storageKey = 'time-tracker-local-storage-key';
    }

    /**
     * @returns {{ tasks: TaskModel[]; presets: PresetModel[]; tags: TagModel[] }}
     */
    load() {
        try {
            const rawString = localStorage.getItem(this.storageKey);
            if (!rawString) {
                console.log(`Local storage is empty`);

                return { tasks: [], presets: [], tags: [] };
            }

            /** @type {RawValue} **/
            const raw = JSON.parse(rawString);

            /** @type {{ tasks: TaskModel[]; presets: PresetModel[]; tags: TagModel[] }} **/
            const result = {
                tasks: raw.tasks.map((task) => new TaskModel({
                    id: task.id,
                    title: task.title,
                    durationInSeconds: task.durationInSeconds,
                    startedAt: task.startedAt ? new Date(task.startedAt) : undefined,
                    finishedIntervals: this._getFinishedIntervals(task),
                    tags: (task.tags ?? []).map((tag) => new TagModel({
                        title: tag.title,
                        color: tag.color,
                    })),
                })),
                presets: raw.presets.map((preset) => new PresetModel({
                    id: preset.id,
                    title: preset.title,
                    tags: (preset.tags ?? []).map((tag) => new TagModel({
                        title: tag.title,
                        color: tag.color,
                    })),
                })),
                tags: (raw.tags ?? []).map((tag) => new TagModel({
                    title: tag.title,
                    color: tag.color,
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
     * @param {TagModel[]} params.tags
     */
    save({ tasks, presets, tags }) {
        try {
            /** @type {RawValue} */
            const raw = {
                tasks: tasks.map((task) => ({
                    id: task.id,
                    title: task.title,
                    durationInSeconds: task._durationInSeconds,
                    startedAt: task._startedAt ? task._startedAt.toString() : undefined,
                    finishedIntervals: task._finishedIntervals.map((interval) => ({
                        startedAt: interval.startedAt.toISOString(),
                        finishedAt: interval.finishedAt.toISOString(),
                    })),
                    tags: task.tags.map((tag) => ({
                        title: tag.title,
                        color: tag.color,
                    })),
                })),
                presets: presets.map((preset) => ({
                    id: preset.id,
                    title: preset.title,
                    tags: preset.tags.map((tag) => ({
                        title: tag.title,
                        color: tag.color,
                    })),
                })),
                tags: tags.map((tag) => ({
                    title: tag.title,
                    color: tag.color,
                })),
            };

            const rawString = JSON.stringify(raw);

            localStorage.setItem(this.storageKey, rawString);

            console.log(`Saved to local storage at ${new Date().toLocaleString()}`);
        } catch (error) {
            console.error(`Error saving to local storage: ${error.message}`);
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

const trackerLocalStorageService = new TrackerLocalStorageService();
