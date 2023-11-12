class ResultTextComponent extends Component {
    constructor() {
        super();

        this._subscriber = new Subscriber(() => this.redraw())

        pageModel.connect('sourceText', this._subscriber);
    }

    onDestroy() {
        pageModel.disconnect('sourceText', this._subscriber);
    }

    toHtml() {
        const text = pageModel.resultHtml;

        return t`
            <div class="result-text">
                ${text}
            </div>
        `;
    }
}

