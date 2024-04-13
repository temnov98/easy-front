class TrackerSettingsModalWindowComponent extends Component {
    constructor() {
        super();

        this.subscribe(languageModel.language).redrawOnChange();
    }

    toHtml() {
        return t`
            <div class="tracker-settings-modal-window__container">
                <h2>${languageModel.t(locales.trackerSettings.title)}</h2>

                <button
                    class="tracker-settings-modal-window__button tracker-settings-modal-window__active_button"
                    onclick="${() => trackerSettingsService.exportSettings()}"
                >
                    ${languageModel.t(locales.trackerSettings.exportButtonTitle)}
                </button>

                <button
                    class="tracker-settings-modal-window__button tracker-settings-modal-window__disabled_button"
                    onclick="${() => trackerSettingsService.importSettings()}"
                >
                    ${languageModel.t(locales.trackerSettings.importButtonTitle)}
                </button>

                <p>${languageModel.t(locales.trackerSettings.description)}</p>
            </div>
        `;
    }
}

modalWindowModel.registerModal('TrackerSettingsModalWindowComponent', TrackerSettingsModalWindowComponent);
