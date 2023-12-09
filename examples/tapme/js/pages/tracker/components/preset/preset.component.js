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
            <div class="row preset-component-container">
                <div class="hide-by-default selected-row"></div>

                <div class="row preset-component">
                    <div class="padding-2 max-width">${new PresetTextComponent(this.preset)}</div>
                    <div class="padding-2 hide-by-default">${new PresetAddTaskButtonComponent(this.preset)}</div>
                    <div class="padding-2 hide-by-default">${new PresetDeleteButtonComponent(this.preset)}</div>
                </div>

                <div>
                    ${new TagsBlockComponent(this.preset)}
                </div>
            </div>
        `;
    }
}
