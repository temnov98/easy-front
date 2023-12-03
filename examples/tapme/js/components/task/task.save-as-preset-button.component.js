class TaskSaveAsPresetButtonComponent extends Component {
    /**
     * @param {TaskModel} task
     */
    constructor(task) {
        super();

        this.task = task;
    }

    addPreset() {
        pageModel.addPreset(new PresetModel({
            title: this.task.title,
            tags: this.task.tags,
        }));
    }

    toHtml() {
        return t`
            <button
                class="icon-button"
                onclick="${() => this.addPreset()}">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.001 4.52898C14.35 2.41998 17.98 2.48998 20.243 4.75698C22.505 7.02498 22.583 10.637 20.479 12.993L11.999 21.485L3.52101 12.993C1.41701 10.637 1.49601 7.01898 3.75701 4.75698C6.02201 2.49298 9.64501 2.41698 12.001 4.52898ZM18.827 6.16998C17.327 4.66798 14.907 4.60698 13.337 6.01698L12.002 7.21498L10.666 6.01798C9.09101 4.60598 6.67601 4.66798 5.17201 6.17198C3.68201 7.66198 3.60701 10.047 4.98001 11.623L12 18.654L19.02 11.624C20.394 10.047 20.319 7.66498 18.827 6.16998Z" fill="none"/>
                    </svg>
            </button>
        `;
    }
}
