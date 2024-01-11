class ErrorModalComponent extends Component {
    /**
     * @param {Record<string, string>} message
     * @param {Record<string, string>} okButtonTitle
     */
    constructor({ message, okButtonTitle }) {
        super();

        this.message = message;
        this.okButtonTitle = okButtonTitle;

        this.subscribe(languageModel.language).redrawOnChange();
    }

    toHtml() {
        const message = languageModel.t(this.message);
        const okButtonTitle = languageModel.t(this.okButtonTitle);

        return t`
            <div class="error-modal-window__container">
                <h1>${message}</h1>
                <div>
                    <button
                        class="error-modal-window__ok_button"
                        onclick="${() => modalWindowModel.closeModal()}"
                    >
                        ${okButtonTitle}
                    </button>
                </div>
            </div>
        `;
    }
}

modalWindowModel.registerModal('ErrorModalComponent', ErrorModalComponent);
