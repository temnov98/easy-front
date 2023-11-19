class LetterComponent extends Component {
    /**
     * @param {LetterModel} model
     */
    constructor(model) {
        super();

        this.model = model;
    }

    onChange() {
        this.model.selected = !this.model.selected;
        pageModel.updateResultText();
    }

    toHtml() {
        const name = Math.random().toString();

        return t`
            <div>
                <input
                    type="checkbox"
                    name="${name}"
                    ${this.model.selected ? 'checked' : ''}
                    onchange="${() => this.onChange()}"
                />
                <label for="${name}">${this.model.foreign} - ${this.model.description}</label>
            </div>
        `;
    }
}

