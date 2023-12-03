class PageModel extends BaseModel {
    constructor() {
        super();

        const { tasks, presets } = localStorageService.load();

        this.tasks = this.createObservable(tasks, 'tasks');
        this.presets = this.createObservable(presets, 'presets');
        this.totalTimeFormatted = this.createObservable(this.getTotalTimeFormatted(), 'totalTimeFormatted');
        this.theme = this.createObservable(localStorageService.getItem('theme') || 'light', 'theme');
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';

        localStorageService.setItem('theme', this.theme);
    }

    updateTotalTime() {
        this.totalTimeFormatted = this.getTotalTimeFormatted();
    }

    getTotalTimeFormatted() {
        const durationInSeconds = this.tasks.reduce((result, task) => result + task.durationInSeconds, 0);

        return timeFormatService.durationFormatted(durationInSeconds);
    }

    addTasksFromPresets() {
        const tasks = this.presets.map((preset) => new TaskModel({
            title: preset.title,
            tags: preset.tags,
        }));

        this.tasks = [...this.tasks, ...tasks];

        this.saveToLocalStorage();
    }

    /**
     * @param {PresetModel} preset
     */
    addPreset(preset) {
        this.presets = [...this.presets, preset];

        this.saveToLocalStorage();
    }

    /**
     * @param {PresetModel} preset
     */
    deletePreset(preset) {
        this.presets = this.presets.filter((currentPreset) => currentPreset.id !== preset.id);

        this.saveToLocalStorage();
    }

    /**
     * @param {TaskModel} task
     */
    addTask(task) {
        this.tasks = [...this.tasks, task];

        this.saveToLocalStorage();
    }

    /**
     * @param {TaskModel} task
     */
    deleteTask(task) {
        this.tasks = this.tasks.filter((currentTask) => currentTask.id !== task.id);
        this.updateTotalTime();

        this.saveToLocalStorage();
    }

    /**
     * @param {TaskModel} task
     * @param {string} text
     * @returns {void}
     */
    changeTaskText(task, text) {
        /** @type {TaskModel | undefined} */
        const editedTask = this.tasks.find((currentTask) => currentTask.id === task.id);
        if (!editedTask) {
            return;
        }

        editedTask.title = text;

        this.saveToLocalStorage();
    }

    /**
     * @param {PresetModel} preset
     * @param {string} text
     * @returns {void}
     */
    changePresetText(preset, text) {
        /** @type {TaskModel | undefined} */
        const editedPreset = this.presets.find((currentPreset) => currentPreset.id === preset.id);
        if (!editedPreset) {
            return;
        }

        editedPreset.title = text;

        this.saveToLocalStorage();
    }

    /**
     * @param {TaskModel} task
     */
    toggle(task) {
        this.tasks.forEach((currentTask) => {
            if (currentTask.id !== task.id) {
                currentTask.stop();
            } else {
                currentTask.toggle();
            }
        });

        this.saveToLocalStorage();
    }

    saveToLocalStorage() {
        localStorageService.save({
            tasks: this.tasks,
            presets: this.presets,
        });
    }

    /**
     * @param {TaskModel | PresetModel} model
     * @param {string} title
     * @return {boolean}
     */
    addTag(model, title) {
        const hasThisTitle = model.tags.some((tag) => tag.title.toLowerCase() === title.toLowerCase());
        if (hasThisTitle) {
            return false;
        }

        const tag = new TagModel({ title, color: this._getTagColor(title) });

        model.tags = [...model.tags, tag];

        this.saveToLocalStorage();

        return true;
    }

    /**
     * @param {TaskModel | PresetModel} model
     * @param {TagModel} tag
     */
    deleteTag(model, tag) {
        model.tags = model.tags.filter((currentTag) => currentTag.id !== tag.id)

        this.saveToLocalStorage();
    }

    _getTagColor(title) {
        const allTags = [
            ...this.tasks.map((task) => task.tags).flat(),
            ...this.presets.map((preset) => preset.tags).flat(),
        ];

        const tag = allTags.find((tag) => tag.title.toLowerCase() === title.toLowerCase());

        return tag ? tag.color : this._generateRandomHexColor();
    }

    _generateRandomHexColor() {
        const getHex = () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0');

        return `#${getHex()}${getHex()}${getHex()}`;
    }
}

const pageModel = new PageModel();

