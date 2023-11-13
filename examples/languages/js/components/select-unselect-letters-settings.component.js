class SelectUnselectLettersSettingsComponent extends Component {
    onClickSelectUnselect() {
        const hasSelected = pageModel.letters.some((letter) => letter.selected);
        const hasUnselected = pageModel.letters.some((letter) => !letter.selected);

        if (!hasSelected) {
            pageModel.selectAll();
        } else if (!hasUnselected) {
            pageModel.unselectAll();
        } else {
            pageModel.selectAll();
        }
    }

    toHtml() {
        return t`
            <button
                 class="select-button"
                 onclick="${() => this.onClickSelectUnselect()}"
             >
                Select/Unselect all
            </button>
        `;
    }
}
