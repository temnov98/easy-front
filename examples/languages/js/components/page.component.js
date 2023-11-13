class PageComponent extends Component {
    toHtml() {
        return t`
            <div class="row">
                <div class="column">
                    ${LanguagesSettingsComponent}
                    ${SettingsComponent}
                    ${LettersBlockComponent}
                    ${SourceTextComponent}
                </div>
                <div class="column">
                    ${ResultTextComponent}
                </div>
            </div>
        `;
    }
}

