class DeleteModalWindowComponent extends Component {
    /**
     * @param {() => void} onDelete
     * @param {string} title
     */
    constructor({ onDelete, title }) {
        super();

        this.onDelete = onDelete;
        this.title = title;
    }

    onDeleteClick() {
        this.onDelete();
        modalWindowModel.closeModal();
    }

    toHtml() {
        return t`
            <div class="delete-active-tasks-window">
                <h1>${this.title}</h1>
                <div>
                     <button
                         class="delete-active-tasks-window-red-button"
                         onclick="${() => this.onDeleteClick()}"
                     >
                        Yes, delete
                    </button>
                    <button
                        class="delete-active-tasks-window-green-button"
                        onclick="${() => modalWindowModel.closeModal()}"
                    >
                        No, close window
                    </button>
                </div>
            </div>
        `;
    }
}

modalWindowModel.registerModal('DeleteModalWindowComponent', DeleteModalWindowComponent);
