class PresetTextComponent extends Component {
    /**
     * @param {PresetModel} preset
     */
    constructor(preset) {
        super();

        this.preset = preset;

        this.inputId = `preset-input-id-${preset.id}`;
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

        if (event.key === 'Enter' || event.key === 'Escape') {
            this.element.blur();
        }
    }

    onFocusOut() {
        if (this.inputValue.trim()) {
            pageModel.changePresetText(this.preset, this.inputValue);
        } else {
            pageModel.deletePreset(this.preset);
        }
    }

    toHtml() {
        return t`
            <textarea
                id="${this.inputId}"
                class="preset-text"
                onblur="${() => this.onFocusOut()}"
                onkeydown="${(event) => this.onKeyDown(event)}"
            >${this.preset.title.trim()}</textarea>
        `;
    }
}
