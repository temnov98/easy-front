class TrackerPageModel extends BaseModel {
    constructor() {
        super();

        const { tasks, presets, tags } = trackerLocalStorageService.load();

        this.tags = this.createObservable(tags, 'tags');
        this.tagsSettingsOpened = this.createObservable(false, 'tagsSettingsOpened');
        this.tasks = this.createObservable(tasks, 'tasks');
        this.presets = this.createObservable(presets, 'presets');
        this.totalTimeFormatted = this.createObservable(this.getTotalTimeFormatted(), 'totalTimeFormatted');
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


    deleteActiveTasks() {
        this.tasks = [];
        this.updateTotalTime();

        this.saveToLocalStorage();
    }

    /**
     * @param {PresetModel} preset
     */
    addTaskFromPreset(preset) {
        const task = new TaskModel({
            title: preset.title,
            tags: preset.tags,
        });

        this.tasks = [...this.tasks, task];

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
        trackerLocalStorageService.save({
            tasks: this.tasks,
            presets: this.presets,
            tags: this.tags,
        });
    }

    /**
     * @param {TaskModel | PresetModel | TrackerPageModel} model
     * @param {string} title
     * @return {boolean}
     */
    addTag(model, title) {
        const modelAlreadyHasTitle = model.tags.some((tag) => this._formatTagTitle(tag.title) === this._formatTagTitle(title));
        if (modelAlreadyHasTitle) {
            return false;
        }

        const tag = new TagModel({ title, color: this.getTagColor(title) });
        model.tags = [...model.tags, tag];

        const alreadyHasTitle = this.tags.some((tag) => this._formatTagTitle(tag.title) === this._formatTagTitle(title));
        if (!alreadyHasTitle) {
            this.tags = [...this.tags, tag];
        }

        this.saveToLocalStorage();

        return true;
    }

    /**
     * @param {TaskModel | PresetModel | TrackerPageModel} model
     * @param {TagModel} tag
     */
    deleteTag(model, tag) {
        model.tags = model.tags.filter((currentTag) => !this._tagsEqual(currentTag, tag));

        if (model instanceof TrackerPageModel) {
            for (const task of this.tasks) {
                task.tags = task.tags.filter((currentTag) => !this._tagsEqual(currentTag, tag));
            }

            for (const preset of this.presets) {
                preset.tags = preset.tags.filter((currentTag) => !this._tagsEqual(currentTag, tag));
            }
        }

        this.saveToLocalStorage();
    }

    /**
     * @param {TagModel} tag
     * @param {string} newColor
     */
    changeTagColor(tag, newColor) {
        const allTags = this._getAllTags();

        for (const currentTag of allTags) {
            if (this._tagsEqual(currentTag, tag)) {
                currentTag.color = newColor;
            }
        }

        this.saveToLocalStorage();
    }

    /**
     * @param {TagModel} tag
     * @param {string} newTitle
     * @return {boolean}
     */
    changeTagTitle(tag, newTitle) {
        const oltTitle = tag.title;

        if (!this._tagTitlesEqual(oltTitle, newTitle)) {
            const alreadyHasTitle = this.tags.some((currentTag) => this._tagTitlesEqual(currentTag.title, newTitle));
            if (alreadyHasTitle) {
                return false;
            }
        }

        const allTags = this._getAllTags();

        for (const currentTag of allTags) {
            if (this._tagTitlesEqual(currentTag.title, oltTitle)) {
                currentTag.title = newTitle;
            }
        }

        this.saveToLocalStorage();

        return true;
    }

    /**
     * @private
     * @return {TagModel[]}
     */
    _getAllTags() {
        return [
            ...this.tasks.map((task) => task.tags).flat(),
            ...this.presets.map((preset) => preset.tags).flat(),
            ...this.tags.flat(),
        ];
    }

    /**
     * @param {string} left
     * @param {string} right
     * @private
     */
    _tagTitlesEqual(left, right) {
        return this._formatTagTitle(left) === this._formatTagTitle(right);
    }

    /**
     * @param {TagModel} left
     * @param {TagModel} right
     * @private
     */
    _tagsEqual(left, right) {
        return this._formatTagTitle(left.title) === this._formatTagTitle(right.title);
    }

    _formatTagTitle(title) {
        return title.toLowerCase();
    }

    /**
     * @param {string} title
     * @return {string}
     */
    getTagColor(title) {
        const tag = this.tags.find((tag) => this._formatTagTitle(tag.title) === this._formatTagTitle(title));

        return tag ? tag.color : generateRandomHexColor();
    }
}

const trackerPageModel = new TrackerPageModel();

