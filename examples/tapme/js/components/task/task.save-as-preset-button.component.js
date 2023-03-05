class TaskSaveAsPresetButtonComponent extends Component {
    /**
     * @param {TaskModel} task
     */
    constructor(task) {
        super();

        this.task = task;
    }

    toHtml() {
        return t`
            <div>
                <button
                    class="save-task-as-preset-button"
                    onclick="${() => pageModel.addPreset(new PresetModel({ title: this.task.title }))}">
                    +
                </button>
            </div>
        `;
    }
}
