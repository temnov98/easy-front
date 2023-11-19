class ReplacedSettingsContainer extends Component {
    toHtml() {
        return t`
            <div>
                <label class="for-replaced-container">
                    Bold for replaced
                    <input
                        type="checkbox"
                        ${pageModel.boldForReplaced ? 'checked' : ''}
                        onchange="${() => pageModel.toggleBold()}"
                    >
                    <span class="for-replaced-checkmark"></span>
                </label>

                <label class="for-replaced-container">
                    Color for replaced
                    <input
                        type="checkbox"
                        ${pageModel.colorForReplaced ? 'checked' : ''}
                        onchange="${() => pageModel.toggleColor()}"
                    >
                    <span class="for-replaced-checkmark"></span>
                </label>
            </div>
        `;
    }
}
