class ErrorModalComponent extends Component {
    /**
     * @param {Record<string, string> | string} message
     * @param {(string | Record<string, string>)[]} [items]
     * @param {Record<string, string> | string} okButtonTitle
     */
    constructor({ message, items, okButtonTitle }) {
        super();

        this.message = message;
        this.items = items ?? [];
        this.okButtonTitle = okButtonTitle;

        this.subscribe(languageModel.language).redrawOnChange();
    }

    toHtml() {
        const message = languageModel.t(this.message);
        const okButtonTitle = languageModel.t(this.okButtonTitle);
        const items = this.items.length
            ? this.items.map((item) => `<p>${languageModel.t(item)}</p>`)
            : '';

        return t`
            <div class="error-modal-window__container">
                <h1>${message}</h1>
                ${items}
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
