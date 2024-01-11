class LanguageOptionComponent extends Component {
    constructor(language) {
        super();

        const titleMapping = {
            [Language.English]: 'ENG',
            [Language.Russian]: 'RUS',
            [Language.Kazakh]: 'KAZ',
            [Language.Georgian]: 'GEO',
        };

        this.title = titleMapping[language];
        this.value = language;
    }

    toHtml() {
        return t`
            <option
                value="${this.value}"
                ${languageModel.language === this.value ? 'selected' : ''}
            >
                ${this.title}
            </option>
        `
    }
}

class ChangeLanguageComponent extends Component {
    constructor() {
        super();

        this.selectId = getId();

        this.subscribe(languageModel.language).redrawOnChange();
    }

    get selectElement() {
        return document.getElementById(this.selectId);
    }

    onSelectLanguage() {
        languageModel.setLanguage(this.selectElement.value);
    }

    toHtml() {
        const availableLanguages = Object.values(Language);

        const options = availableLanguages.map((language) => new LanguageOptionComponent(language));

        return t`
            <div class="change-language-component__container">
                <select
                    id="${this.selectId}"
                    onchange="${() => this.onSelectLanguage()}"
                >
                    ${options}
                </select>
            </div>
        `;
    }
}
