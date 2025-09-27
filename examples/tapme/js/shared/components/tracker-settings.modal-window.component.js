class TrackerSettingsTimeIntervalEditingComponent extends Component {
    constructor() {
        super();

        this.subscribe(experimentalFeatureModel.updatedAt).redrawOnChange();
    }

    toHtml() {
        const feature = ExperimentalFeature.TimeIntervalEditing;

        return t`
            <label class="tracker-settings-modal-window__time_interval_editing">
                <input
                    type="checkbox"  
                    onchange="${() => experimentalFeatureModel.toggleFeature(feature)}"
                    ${experimentalFeatureModel.isFeatureEnabled(feature) && 'checked'}
                >
                <span>
                    ${languageModel.t(locales.trackerSettings.experimentalFeatureTimeIntervalEditing)}
                </span>
            </label>
        `;
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
