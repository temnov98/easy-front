class ExperimentalFeatureModel extends BaseModel {
    constructor() {
        super();

        this._storageKeyPrefix = 'time-tracker-local-storage-key:experimental-features:value';

        const availableFeatures = allExperimentalFeatures
            .filter((featureName) => this._getFeatureAvailability(featureName));

        this._availableFeatures = new Set(availableFeatures);

        this.updatedAt = this.createObservable(Date.now(), 'updatedAt');
    }

    /**
     * @param {ExperimentalFeature} featureName
     * @return {boolean}
     */
    isFeatureEnabled(featureName) {
        return this._availableFeatures.has(featureName);
    }

    /**
     * @param {ExperimentalFeature} featureName
     * @return {void}
     */
    toggleFeature(featureName) {
        if (this._availableFeatures.has(featureName)) {
            this._availableFeatures.delete(featureName);
            this._saveFeatureAvailability(featureName, false);
        } else {
            this._availableFeatures.add(featureName);
            this._saveFeatureAvailability(featureName, true);
        }

        this.updatedAt = Date.now();
    }

    /**
     * @param {ExperimentalFeature} featureName
     * @return {boolean}
     */
    _getFeatureAvailability(featureName) {
        return localStorage.getItem(this._getStorageKey(featureName)) === 'true';
    }

    /**
     * @param {ExperimentalFeature} featureName
     * @param {boolean} availability
     * @return {void}
     */
    _saveFeatureAvailability(featureName, availability) {
        localStorage.setItem(this._getStorageKey(featureName), availability.toString());

        const time = new Date().toLocaleString();
        console.log(`Saved feature availability (${featureName} = ${availability}) to local storage at ${time}`);
    }

    /**
     * @param {ExperimentalFeature} featureName
     * @return {string}
     */
    _getStorageKey(featureName) {
        return `${this._storageKeyPrefix}:${featureName}`;
    }
}

const experimentalFeatureModel = new ExperimentalFeatureModel();
