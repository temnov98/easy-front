class TaskTextComponent extends Component {
    /**
     * @param {TaskModel} task
     */
    constructor(task) {
        super();

        this.inputId = `task-input-id-${task.id}`;
        this.task = task;
    }

    get element() {
        return document.getElementById(this.inputId);
    }

    get inputValue() {
        if (!this.element) {
            return undefined;
        }

        return this.element.value;
    }

    onKeyDown(event) {
        if (!event) {
            return;
        }

        if (event.key === 'Enter' || event.key === 'Escape') {
            this.element.blur();
        }
    }

    onFocusOut() {
        pageModel.changeTaskText(this.task, this.inputValue);
    }

    toHtml() {
        return t`
            <textarea
                id="${this.inputId}"
                class="task-text-container-input"
                onblur="${() => this.onFocusOut()}"
                onkeydown="${(event) => this.onKeyDown(event)}"
            >${this.task.title.trim()}</textarea>
        `;
    }
}
