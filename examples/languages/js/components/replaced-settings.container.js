class ReplacedSettingsContainer extends Component {
    onChangeBoldForReplaced() {
        pageModel.boldForReplaced = !pageModel.boldForReplaced;

        pageModel.updateText();
    }

    onChangeColorForReplaced() {
        pageModel.colorForReplaced = !pageModel.colorForReplaced;

        pageModel.updateText();
    }

    toHtml() {
        return t`
            <div>
                <label class="for-replaced-container">
                    Bold for replaced
                    <input type="checkbox" onchange="${() => this.onChangeBoldForReplaced()}">
                    <span class="for-replaced-checkmark"></span>
                </label>

                <label class="for-replaced-container">
                    Color for replaced
                    <input type="checkbox" onchange="${() => this.onChangeColorForReplaced()}">
                    <span class="for-replaced-checkmark"></span>
                </label>
            </div>
        `;
    }
}
