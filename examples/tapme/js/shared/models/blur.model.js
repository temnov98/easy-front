const BlurMode = {
    Enabled: 'Enabled',
    Disabled: 'Disabled',
};

class BlurModel extends BaseModel {
    constructor() {
        super();

        this.blurModeStorageKey = 'time-tracker-local-storage-key:blur:value';

        this.blurMode = this.createObservable(this._getBlurMode(), 'blurMode');
    }

    toggleBlurMode() {
        this.blurMode = this.blurMode === BlurMode.Enabled ? BlurMode.Disabled : BlurMode.Enabled;

        this._saveBlurMode();
    }

    _getBlurMode() {
        return localStorage.getItem(this.blurModeStorageKey) || BlurMode.Disabled;
    }

    _saveBlurMode() {
        localStorage.setItem(this.blurModeStorageKey, this.blurMode);

        console.log(`Saved blur bode to local storage at ${new Date().toLocaleString()}`);
    }
}

const blurModel = new BlurModel();
