class SelectUnselectLettersSettingsComponent extends Component {
    onClickSelectUnselect() {
        const hasUnselected = pageModel.letters.some((letter) => !letter.selected);

        if (!hasUnselected) {
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
