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
                <div class="padding-5 max-width">${new PresetTextComponent(this.preset)}</div>
                <div class="padding-5">${new PresetDeleteButtonComponent(this.preset)}</div>
            </div>
        `;
    }
}
