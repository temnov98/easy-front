class ThemeModel extends BaseModel {
    constructor() {
        super();

        this.themeStorageKey = 'time-tracker-local-storage-key:theme:value';

        this.theme = this.createObservable(this._getTheme(), 'theme');
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';

        this._saveTheme();
    }

    _getTheme() {
        return localStorage.getItem(this.themeStorageKey) || 'light';
    }

    _saveTheme() {
        localStorage.setItem(this.themeStorageKey, this.theme);

        console.log(`Saved theme to local storage at ${new Date().toLocaleString()}`);
    }
}

const themeModel = new ThemeModel();
