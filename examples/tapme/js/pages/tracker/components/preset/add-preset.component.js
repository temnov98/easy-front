class AddPresetComponent extends Component {
    constructor() {
        super();

        this.inputId = `create-preset-input-id-${_getId()}`;
        this.lastKey = '';

        this.subscribe(languageModel.language).redrawOnChange();
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
            event.preventDefault();

            this.element.value = this.element.value.trim();
        }

        if (event.key === 'Enter' || event.key === 'Escape') {
            this.lastKey = event.key;
            this.element.blur();
        }
    }

    onFocusOut() {
        if (this.lastKey === 'Enter' && this.inputValue.trim()) {
            trackerPageModel.addPreset(new PresetModel({ title: this.inputValue }));

            this.element.value = '';
            this.element.focus();
        } else {
            this.element.value = '';
        }
    }

    toHtml() {
        const title = languageModel.t(locales.addPresetTitle);

        return t`
            <div class="row preset-text-container">
                <div class="padding-2 max-width">
                    <textarea
                        id="${this.inputId}"
                        class="preset-text ym-disable-keys"
                        onblur="${() => this.onFocusOut()}"
                        onkeydown="${(event) => this.onKeyDown(event)}"
                        placeholder="${title}..."
                    ></textarea>
                </div>
            </div>
        `;
    }
}
