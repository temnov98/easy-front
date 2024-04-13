class TrackerSettingsService {
    /**
     * @returns {void}
     */
    openUpdatesModalWindow() {
        modalWindowModel.openModal('TrackerSettingsModalWindowComponent');
    }

    /**
     * @returns {void}
     */
    exportSettings() {
        exportFile({
            content: this._getContent(),
            filename: this._getFilename(),
        });
    }

    /**
     * @returns {void}
     */
    importSettings() {
        // todo: implement it
    }

    /**
     * @return {void}
     * @private
     */
    _importVersion1() {
        // todo: implement it
    }

    /**
     * @return {string}
     * @private
     */
    _getContent() {
        return JSON.stringify({
            version: "1",
            tags: trackerPageModel.tags.map((tag) => ({
                color: tag.color,
                title: tag.title,
            })),
            presets: trackerPageModel.presets.map((preset) => ({
                title: preset.title,
                tags: preset.tags.map((tag) => tag.title),
            })),
        }, null, 2);
    }

    /**
     * @return {string}
     * @private
     */
    _getFilename() {
        return 'tapme-settings.json';
    }
}

const trackerSettingsService = new TrackerSettingsService();
