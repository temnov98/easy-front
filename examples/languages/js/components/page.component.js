class PageComponent extends Component {
    toHtml() {
        return t`
            <div class="row">
                <div class="column-30">
                    ${SettingsComponent}
                    ${LettersBlockComponent}
                    ${SourceTextComponent}
                </div>
                <div class="column-70">
                    ${ResultTextComponent}
                </div>
            </div>
        `;
    }
}

