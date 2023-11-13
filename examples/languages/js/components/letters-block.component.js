class LettersBlockComponent extends Component {
    constructor() {
        super();

        this._subscriber = new Subscriber(() => this.redraw(true));
        pageModel.connect('letters', this._subscriber);
    }

    onDestroy() {
        pageModel.disconnect('letters', this._subscriber);
    }

    toHtml() {
        return t`
            <fieldset class="letter-block">
                <legend>Choose letters:</legend>
                ${pageModel.letters.map((item) => new LetterComponent(item))}
            </fieldset>
        `;
    }
}

