class DeleteModalWindowComponent extends Component {
    /**
     * @param {() => void} onDelete
     * @param {Record<string, string>} title
     */
    constructor({ onDelete, title }) {
        super();

        this.onDelete = onDelete;
        this.title = title;

        this.subscribe(languageModel.language).redrawOnChange();
    }

    onDeleteClick() {
        this.onDelete();
        modalWindowModel.closeModal();
    }

    toHtml() {
        return t`
            <div class="delete-active-tasks-window">
                <h1>${languageModel.t(this.title)}</h1>
                <div>
                     <button
                         class="delete-active-tasks-window-red-button"
                         onclick="${() => this.onDeleteClick()}"
                     >
                        ${languageModel.t(locales.deleteModalWindow.yesButtonTitleTitle)}
                    </button>
                    <button
                        class="delete-active-tasks-window-green-button"
                        onclick="${() => modalWindowModel.closeModal()}"
                    >
                        ${languageModel.t(locales.deleteModalWindow.noButtonTitleTitle)}
                    </button>
                </div>
            </div>
        `;
    }
}

modalWindowModel.registerModal('DeleteModalWindowComponent', DeleteModalWindowComponent);
