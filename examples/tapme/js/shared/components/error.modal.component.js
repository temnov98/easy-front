class ErrorModalComponent extends Component {
    /**
     * @param {string} message
     */
    constructor(message) {
        super();

        this.message = message;
    }

    toHtml() {
        return t`
            <div class="error-modal-window__container">
                <h1>${this.message}</h1>
                <div>
                    <button
                        class="error-modal-window__ok_button"
                        onclick="${() => modalWindowModel.closeModal()}"
                    >
                        Ok
                    </button>
                </div>
            </div>
        `;
    }
}

modalWindowModel.registerModal('ErrorModalComponent', ErrorModalComponent);
