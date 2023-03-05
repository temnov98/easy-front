class TaskTextComponent extends Component {
    /**
     * @param {TaskModel} task
     */
    constructor(task) {
        super();

        this.inputId = `task-input-id-${task.id}`;
        this.task = task;
        this.blockOnFocus = false; // todo: плохое решение. 
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

    get containerClass() {
        return this.editMode ? 'task-text-container-edit-mode' : 'task-text-container';
    }

    onClick() {
        if (this.editMode) {
            return;
        }

        this.blockOnFocus = true;
        this.editMode = true;
        this.blockOnFocus = false;

        this.element.focus();

        const value = this.element.value;
        this.element.value = '';
        this.element.value = value;
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
        if (this.blockOnFocus) {
            return;
        }

        if (this.editMode) {
            pageModel.changeTaskText(this.task, this.inputValue);
            this.editMode = false;
        }
    }

    toHtml() {
        return t`
            <div class="${this.containerClass}" onclick="${() => this.onClick()}">
                <textarea
                    id="${this.inputId}"
                    class="task-text-container-input"
                    onfocusout="${() => this.onFocusOut()}"
                    onkeydown="${(event) => this.onKeyDown(event)}"
                />${this.task.title}</textarea>
            </div>
        `;
    }
}
