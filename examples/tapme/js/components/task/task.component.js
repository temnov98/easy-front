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
            <div class="row">
                <div class="column">${new TaskToggleButtonComponent(this.task)}</div>
                <div class="column max-width">${new TaskTextComponent(this.task)}</div>
                <div class="column">${new TaskSaveAsPresetButtonComponent(this.task)}</div>
                <div class="column">${new TaskDeleteButtonComponent(this.task)}</div>
            </div>
        `;
    }
}
