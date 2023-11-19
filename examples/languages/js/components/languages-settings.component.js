class LanguagesSettingsComponent extends Component {
    toHtml() {
        const switcher = new SwitcherComponent({
            onClick: () => pageModel.toggleLanguage(),
            defaultState: pageModel.language === 'georgian',
        });

        return t`
            <div class="row">
                <div class="column language-title">
                    Georgian
                </div>

                <div class="column">
                    ${switcher}
                </div>

                <div class="column language-title">
                    English
                </div>
            </div>
        `;
    }
}

