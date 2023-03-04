class TaskDeleteButtonComponent extends Component {
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
                    class="delete-task-button"
                    onclick="${() => pageModel.deleteTask(this.task)}">
                    X
                </button>
            </div>
        `;
    }
}
