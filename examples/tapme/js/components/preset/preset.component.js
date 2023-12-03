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
                <div class="row preset-component">
                    <div class="padding-5 max-width">${new PresetTextComponent(this.preset)}</div>
                    <div class="padding-5">${new PresetAddTaskButtonComponent(this.preset)}</div>
                    <div class="padding-5">${new PresetDeleteButtonComponent(this.preset)}</div>
                </div>
                <div>
                    ${new TagsBlockComponent(this.preset)}
                </div>
            </div>
        `;
    }
}
