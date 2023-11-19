class SourceTextComponent extends Component {
    constructor() {
        super();

        this.textAreaId = 'source-text-textarea';
    }

    onChange() {
        pageModel.setSourceText(document.getElementById(this.textAreaId).value);
    }

    toHtml() {
        return t`
            <textarea
                class="source-text"
                onkeyup="${() => this.onChange()}"
                onchange="${() => this.onChange()}"
                id="${this.textAreaId}"
            ></textarea>
        `;
    }
}

