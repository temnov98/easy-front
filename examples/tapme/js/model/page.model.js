class PageModel {
    constructor() {
        const { tasks, presets } = localStorageService.load();

        this.tasks = new ObservableValue(tasks);
        this.presets = new ObservableValue(presets);
    }

    addTasksFromPresets() {
        const tasks = this.presets.value.map((preset) => new TaskModel({ title: preset.title }));

        this.tasks.value = [...this.tasks.value, ...tasks];

        this.saveToLocalStorage();
    }

    /**
     * @param {PresetModel} preset
     */
    addPreset(preset) {
        this.presets.value = [...this.presets.value, preset];

        this.saveToLocalStorage();
    }

    /**
     * @param {PresetModel} preset
     */
    deletePreset(preset) {
        this.presets.value = this.presets.value.filter((currentPreset) => currentPreset.id !== preset.id);

        this.saveToLocalStorage();
    }

    /**
     * @param {TaskModel} task
     */
    addTask(task) {
        this.tasks.value = [...this.tasks.value, task];

        this.saveToLocalStorage();
    }

    /**
     * @param {TaskModel} task
     */
    deleteTask(task) {
        this.tasks.value = this.tasks.value.filter((currentTask) => currentTask.id !== task.id);

        this.saveToLocalStorage();
    }

    /**
     * @param {TaskModel} task
     * @param {string} text
     * @returns {void}
     */
    changeTaskText(task, text) {
        /** @type {TaskModel | undefined} */
        const editedTask = this.tasks.value.find((currentTask) => currentTask.id === task.id);
        if (!editedTask) {
            return;
        }

        editedTask.title = text;

        this.saveToLocalStorage();
    }

    /**
     * @param {TaskModel} task
     */
    toggle(task) {
        this.tasks.value.forEach((currentTask) => {
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
            tasks: this.tasks.value,
            presets: this.presets.value,
        });
    }
}

const pageModel = new PageModel();

