class TaskComponent extends Component {
    /**
     * @param {TaskModel} task
     */
    constructor(task) {
        super();

        this.task = task;
    }

    toHtml() {
        return t`
            <div class="row task-component">
                <div >${new TaskToggleButtonComponent(this.task)}</div>
                <div class="max-width">${new TaskTextComponent(this.task)}</div>
                <div >${new TaskSaveAsPresetButtonComponent(this.task)}</div>
                <div >${new TaskDeleteButtonComponent(this.task)}</div>
            </div>
        `;
    }
}
