class SettingsComponent extends Component {
    toHtml() {
        return t`
            <div class="row settings-block">
                <div class="column">
                    ${SelectUnselectLettersSettingsComponent}
                </div>

                <div class="column">
                    ${ReplacedSettingsContainer}
                </div>
            </div>
        `;
    }
}
