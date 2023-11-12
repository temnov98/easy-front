class SettingsComponent extends Component {
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
            <div class="row settings-block">
                <div class="column">
                     <button onclick="${() => pageModel.selectAll()}">
                        Select all
                    </button>
                </div>
               
    
                <div class="column">
                    <button onclick="${() => pageModel.unselectAll()}">
                        Unselect all
                    </button>
                </div>
                
                <div class="column">
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
                </div>
            </div>
        `;
    }
}
