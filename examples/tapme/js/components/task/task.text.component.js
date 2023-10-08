class TaskTextComponent extends Component {
    /**
     * @param {TaskModel} task
     */
    constructor(task) {
        super();

        this.inputId = `task-input-id-${task.id}`;
        this.task = task;
        this.editMode = this.createRedrawable(false, 'editMode');
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

        if (event.key === 'Enter') {
            pageModel.changeTaskText(this.task, this.inputValue);
            this.onFocusOut();
        } else if (event.key === 'Escape') {
            this.onFocusOut();
        }
    }

    onFocusOut() {
        pageModel.changeTaskText(this.task, this.inputValue);
        this.editMode = false;
    }

    toHtml() {
        return t`
            <textarea
                id="${this.inputId}"
                class="task-text-container-input"
                onfocusout="${() => this.onFocusOut()}"
                onkeydown="${(event) => this.onKeyDown(event)}"
            >${this.task.title.trim()}</textarea>
        `;
    }
}
