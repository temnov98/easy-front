class ResultTextComponent extends Component {
    constructor() {
        super();

        this.subscribe(pageModel, 'sourceText', () => this.redraw(true));
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

