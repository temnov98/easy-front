/**
 * @typedef {Object} RawTrackerSettingsVersion1
 * @property {'1'} version
 * @property {{ title: string; color: string }[]} tags
 * @property {{ title: string; tags: string[] }[]} presets
 */

// NOTE: потом просто расширять тип - RawTrackerSettings, добавляя туда разные версии
/** @typedef {RawTrackerSettingsVersion1} RawTrackerSettings */

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
     * @return {Promise<void>}
     */
    async importSettings() {
        try {
            const result = await this._importSettings();

            if (result.success) {
                this._openModalWindow(locales.trackerSettings.resultModal.successTitle);
            } else {
                this._openModalWindow(result.error);
            }
        } catch (error) {
            console.error(`Error on reading settings file: ${error.message}`);

            this._openModalWindow(locales.trackerSettings.resultModal.defaultErrorTitle);
        }
    }

    /**
     * @param {Record<string, string>} title
     * @return {void}
     */
    _openModalWindow(title) {
        modalWindowModel.closeModal();

        // TODO: по факту тут не только ошибки показываются
        modalWindowModel.openModal('ErrorModalComponent', {
            message: title,
            okButtonTitle: locales.trackerSettings.resultModal.okButtonTitle,
        });
    }

    /**
     * @returns {{ success: true } | { success: false; error: Record<string, string> }}
     */
    async _importSettings() {
        const handles = await window.showOpenFilePicker({
            multiple: false,
            types: [
                {
                    description: 'JSON Files',
                    accept: {
                        'application/json': ['.json'],
                    },
                },
            ],
        });

        if (handles.length !== 1) {
            return {
                success: false,
                error: locales.trackerSettings.resultModal.incorrectFileTitle,
            };
        }

        const [handle] = handles;

        const file = await handle.getFile();
        const fileContent = await file.text();

        const settings = JSON.parse(fileContent);

        const mapping = {
            ['1']: () => this._importVersion1(settings),
        };

        const importHandler = mapping[settings.version];
        if (!importHandler) {
            return {
                success: false,
                error: locales.trackerSettings.resultModal.incorrectFileTitle,
            };
        }

        return importHandler();
    }

    /**
     * @param {RawTrackerSettingsVersion1} settings
     * @returns {{ success: true } | { success: false; error: Record<string, string> }}
     * @private
     */
    _importVersion1(settings) {
        const isValidFile = (
            settings.version === '1' &&
            Array.isArray(settings.tags) &&
            Array.isArray(settings.presets) &&
            settings.tags.every((tag) => (
                typeof tag.title === 'string' &&
                typeof tag.color === 'string'
            )) &&
            settings.presets.every((preset) => (
                typeof preset.title === 'string' &&
                Array.isArray(preset.tags) &&
                preset.tags.every((tag) => typeof tag === 'string')
            ))
        )

        if (!isValidFile) {
            return {
                success: false,
                error: locales.trackerSettings.resultModal.incorrectFileTitle,
            };
        }

        // NOTE: дополнительные проверки

        const allTagsTitles = new Set(settings.tags.map((tag) => tag.title));

        const hasIncorrectTagTitle = (
            settings.tags.some((tag) => !tag.title.trim().length) ||
            settings.tags.some((tag) => tag.title !== tag.title.trim())
        );

        const hasIncorrectTagColor = settings.tags.some((tag) => tag.color.length !== 7);

        const hasIncorrectPresetTitle = (
            settings.presets.some((preset) => !preset.title.trim().length) ||
            settings.presets.some((preset) => preset.title !== preset.title.trim())
        );

        const hasIncorrectPresetTags = (
            settings.presets.some((preset) => [...new Set(preset.tags)].length !== preset.tags.length) ||
            settings.presets.some((preset) => preset.tags.some((tag) => !allTagsTitles.has(tag)))
        );

        if (
            hasIncorrectTagTitle ||
            hasIncorrectTagColor ||
            hasIncorrectPresetTitle ||
            hasIncorrectPresetTags
        ) {
            return {
                success: false,
                error: locales.trackerSettings.resultModal.incorrectFileTitle,
            };
        }

        const tags = settings.tags.map((tag) => new TagModel({
            title: tag.title,
            color: tag.color,
        }));

        trackerPageModel.importSettings({
            tags,
            presets: settings.presets.map((preset) => new PresetModel({
                title: preset.title,
                tags: preset.tags.map((tag) => tags.find((tagModel) => tagModel.title === tag)),
            })),
        });

        return {
            success: true,
        };
    }

    /**
     * @return {string}
     * @private
     */
    _getContent() {
        /** @type {RawTrackerSettings} */
        const raw = {
            version: "1",
            tags: trackerPageModel.tags.map((tag) => ({
                title: tag.title.trim(),
                color: tag.color,
            })),
            presets: trackerPageModel.presets.map((preset) => ({
                title: preset.title.trim(),
                tags: preset.tags.map((tag) => tag.title.trim()),
            })),
        };

        return JSON.stringify(raw, null, 2);
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
