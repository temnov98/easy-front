class LanguageModel extends BaseModel {
    constructor() {
        super();

        this.defaultLanguage = Language.English;
        this.languageStorageKey = 'time-tracker-local-storage-key:language:value';

        this.language = this.createObservable(this._getLanguage(), 'language');
    }

    /**
     * @param {Record<string, string> | string} locale
     */
    t(locale) {
        if (typeof locale === 'string') {
            return locale;
        }

        return locale[this.language];
    }

    setLanguage(language) {
        if (this.language === language) {
            return;
        }

        this.language = language;

        this._saveLanguage();
    }

    _getLanguage() {
        return localStorage.getItem(this.languageStorageKey) || this.defaultLanguage;
    }

    _saveLanguage() {
        localStorage.setItem(this.languageStorageKey, this.language);

        console.log(`Saved language to local storage at ${new Date().toLocaleString()}`);
    }
}

const languageModel = new LanguageModel();
