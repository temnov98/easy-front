class PresetComponent extends Component {
    /**
     * @param {PresetModel} preset
     */
    constructor(preset) {
        super();

        this.preset = preset;
    }

    toHtml() {
        return t`
            <div class="row">
                <div class="column max-width">${new PresetTextComponent(this.preset.title)}</div>
                <div class="column">${new PresetDeleteButtonComponent(this.preset)}</div>
            </div>
        `;
    }
}
