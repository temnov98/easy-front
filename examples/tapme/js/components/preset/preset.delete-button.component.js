class PresetDeleteButtonComponent extends Component {
    /**
     * @param {PresetModel} preset
     */
    constructor(preset) {
        super();

        this.preset = preset;
    }

    toHtml() {
        return t`
            <div>
                <button
                    class="delete-preset-button"
                    onclick="${() => pageModel.deletePreset(this.preset)}">
                    X
                </button>
            </div>
        `;
    }
}
