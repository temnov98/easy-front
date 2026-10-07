class TrackerSettingsCheckBoxComponent extends Component {
    constructor({ feature, titleTemplate, className, onChange }) {
        super();

        this.subscribe(experimentalFeatureModel.updatedAt).redrawOnChange();

        this.feature = feature;
        this.titleTemplate = titleTemplate;
        this.className = className;
        this.onChange = onChange;
    }

    _onChange() {
        experimentalFeatureModel.toggleFeature(this.feature);
        this.onChange();
    }

    toHtml() {
        return t`
            <label class="tracker-settings-modal-window__checkbox ${this.className}">
                <input
                    type="checkbox"  
                    onchange="${() => this._onChange()}"
                    ${experimentalFeatureModel.isFeatureEnabled(this.feature) && 'checked'}
                >
                <span>
                    ${languageModel.t(this.titleTemplate)}
                </span>
            </label>
        `;
    }
}

class TrackerSettingsTimeIntervalEditingComponent extends TrackerSettingsCheckBoxComponent {
    constructor() {
        super({
            feature: ExperimentalFeature.TimeIntervalEditing,
            titleTemplate: locales.trackerSettings.experimentalFeatureTimeIntervalEditing,
            className: 'tracker-settings-modal-window__time_interval_editing',
            onChange: () => {},
        });
    }
}

class TrackerSettingsPictureInPictureComponent extends TrackerSettingsCheckBoxComponent {
    constructor() {
        super({
            feature: ExperimentalFeature.PictureInPicture,
            titleTemplate: locales.trackerSettings.experimentalFeaturePictureInPicture,
            className: 'tracker-settings-modal-window__picture_in_picture',
            onChange: () => trackerPipService.onFeatureToggled(),
        });
    }
}

class TrackerSettingsModalWindowComponent extends Component {
    constructor() {
        super();

        this.subscribe(languageModel.language).redrawOnChange();
    }

    toHtml() {
        return t`
            <div class="tracker-settings-modal-window__container">
                <h2>${languageModel.t(locales.trackerSettings.title)}</h2>

                <div class="tracker-settings-modal-window__experimental_features_title">
                    ${languageModel.t(locales.trackerSettings.experimentalFeaturesTitle)}
                </div>

                ${new TrackerSettingsTimeIntervalEditingComponent()}
                ${new TrackerSettingsPictureInPictureComponent()}

                <div class="tracker-settings-modal-window__export_settings_title">
                    ${languageModel.t(locales.trackerSettings.importExportSettingsTitle)}
                </div>

                <button
                    class="tracker-settings-modal-window__button tracker-settings-modal-window__active_button"
                    onclick="${() => trackerSettingsService.exportSettings()}"
                >
                    ${languageModel.t(locales.trackerSettings.exportButtonTitle)}
                </button>

                <button
                    class="tracker-settings-modal-window__button tracker-settings-modal-window__active_button"
                    onclick="${() => trackerSettingsService.importSettings()}"
                >
                    ${languageModel.t(locales.trackerSettings.importButtonTitle)}
                </button>

                <div class="tracker-settings-modal-window__description">
                    <p>${languageModel.t(locales.trackerSettings.description)}</p>
                    <p>${languageModel.t(locales.trackerSettings.importDescription)}</p>
                </div>
            </div>
        `;
    }
}

modalWindowModel.registerModal('TrackerSettingsModalWindowComponent', TrackerSettingsModalWindowComponent);
