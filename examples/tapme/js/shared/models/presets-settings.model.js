class PresetsSettingsModel extends BaseModel {
    constructor() {
        super();

        this.isPresetsVisibleStorageKey = 'time-tracker-local-storage-key:preset-settings:visibility';

        this.isPresetsVisible = this.createObservable(this._getVisibility(), 'isPresetsVisible');
    }

    togglePresetsVisibility() {
        this.isPresetsVisible = !this.isPresetsVisible;

        this._saveVisibility();
    }

    _getVisibility() {
        const visibilityRaw = localStorage.getItem(this.isPresetsVisibleStorageKey) || 'true';

        return visibilityRaw === 'true';
    }

    _saveVisibility() {
        localStorage.setItem(this.isPresetsVisibleStorageKey, this.isPresetsVisible.toString());

        console.log(`Saved presets visibility to local storage at ${new Date().toLocaleString()}`);
    }
}

const presetsSettingsModel = new PresetsSettingsModel();
