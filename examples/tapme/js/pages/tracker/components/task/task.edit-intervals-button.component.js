class TaskEditIntervalsButtonComponent extends Component {
    /**
     * @param {TaskModel} task
     */
    constructor(task) {
        super();

        this.task = task;

        this.subscribe(languageModel.language).redrawOnChange();
    }

    onClick() {
        if (this.task.isActive) {
            return;
        }

        modalWindowModel.openModal('TaskIntervalsModalWindowComponent', { task: this.task });
    }

    toHtml() {
        const disabled = this.task.isActive;

        return t`
            <button
                class="icon-button icon-button--pen"
                ${disabled && 'disabled'}
                title="${languageModel.t(locales.taskIntervalsModal.editButtonTooltip)}"
                aria-label="${languageModel.t(locales.taskIntervalsModal.editButtonTooltip)}"
                onclick="${() => this.onClick()}"
            >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
                    <path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
            </button>
        `;
    }
}
