class PresetsListComponent extends Component {
    constructor() {
        super();

        this._subscriber = new Subscriber(() => this.redraw());

        pageModel.presets.connect(this._subscriber);
    }

    onDestroy() {
        pageModel.presets.disconnect(this._subscriber);
    }

    toHtml() {
        return t`
            <div class="preset-list-component">
                ${pageModel.presets.value.map((preset) => [
                    new PresetComponent(preset),
                ])}
            </div>
        `;
    }
}
