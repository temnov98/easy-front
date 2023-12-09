class PresetsInnerListComponent extends AutoSubscribeComponent {
    toHtml() {
        return t`
            <div>
                ${trackerPageModel.presets.map((preset) => [new PresetComponent(preset)])}
            </div>
        `;
    }
}

class PresetsListComponent extends Component {
    toHtml() {
        return t`
            <div class="preset-list-component">
                ${PresetsInnerListComponent}
                ${AddPresetComponent}
            </div>
        `;
    }
}
