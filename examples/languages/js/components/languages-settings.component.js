class LanguagesSettingsComponent extends Component {
    constructor() {
        super();

        this.language = 'georgian';
    }
    onClick() {
        if (this.language === 'georgian') {
            pageModel.setLanguage(englishLetters);
            pageModel.unselectAll();

            this.language = 'english';
        } else {
            pageModel.setLanguage(georgianLetters);
            pageModel.unselectAll();

            this.language = 'georgian';
        }
    }

    toHtml() {
        return t`
            <div class="row">
                <div class="column language-title">
                    Georgian
                </div>

                <div class="column">
                    ${new SwitcherComponent({ onClick: () => this.onClick(), defaultState: true })}
                </div>

                <div class="column language-title">
                    English
                </div>
            </div>
        `;
    }
}

