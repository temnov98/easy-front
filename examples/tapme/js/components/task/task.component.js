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
                <div class="padding-10">${new TaskToggleButtonComponent(this.task)}</div>
                <div class="padding-10 max-width">${new TaskTextComponent(this.task)}</div>
                <div class="padding-10">${new TaskSaveAsPresetButtonComponent(this.task)}</div>
                <div class="padding-10">${new TaskDeleteButtonComponent(this.task)}</div>
            </div>
        `;
    }
}
