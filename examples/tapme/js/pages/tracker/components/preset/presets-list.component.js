class PresetsInnerListComponent extends AutoSubscribeComponent {
    toHtml() {
        const list = new MovableListComponent({
            items: trackerPageModel.presets.map((preset) => new PresetComponent(preset)),
            checkAvailability: (target) => target.className.includes('selected-row'),
            onChange: ({ from, to }) => trackerPageModel.movePresets({ from, to }),
            disableRedrawOnChange: true,
        });

        return t`
            <div>
                ${list}
            </div>
        `;
    }
}

class PresetsListComponent extends AutoSubscribeComponent {
    toHtml() {
        return t`
            <div class="preset-list-component">
                ${ChangePresetsVisibilityComponent}
                ${presetsSettingsModel.isPresetsVisible ? PresetsInnerListComponent : ''}
                ${presetsSettingsModel.isPresetsVisible ? AddPresetComponent : ''}
            </div>
        `;
    }
}
