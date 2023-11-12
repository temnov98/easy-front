class LetterComponent extends Component {
    /**
     * @param {LetterModel} model
     */
    constructor(model) {
        super();

        this.model = model;

        this._subscriber = new Subscriber(() => this.redraw())
        this.model.connect('selected', this._subscriber);
    }

    onDestroy() {
        this.model.disconnect('selected', this._subscriber);
    }

    onChange() {
        this.model.selected = !this.model.selected;

        pageModel.updateText();
    }

    toHtml() {
        const name = Math.random().toString();

        if (this.model.selected) {
            return t`
                <div>
                    <input
                        type="checkbox"
                        name="${name}"
                        checked
                        onchange="${() => this.onChange()}"
                    />
                    <label for="${name}">${this.model.foreign} - ${this.model.description}</label>
                </div>
            `;
        } else {
            return t`
                <div>
                     <input
                        type="checkbox"
                        name="${name}"
                        onchange="${() => this.onChange()}"
                    />
                    <label for="${name}">${this.model.foreign} - ${this.model.description}</label>
                </div>
            `;
        }
    }
}

