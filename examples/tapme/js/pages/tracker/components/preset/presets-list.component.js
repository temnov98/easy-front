class PresetsInnerListComponent extends AutoSubscribeComponent {
    toHtml() {
        const presets = trackerPageModel.presets.map((preset) => [new PresetComponent(preset)]);

        const list = new MovableListComponent(presets, (target) => target.className.includes('selected-row'));

        return t`
            <div>
                ${list}
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
