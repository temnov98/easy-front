class ResultTextComponent extends Component {
    constructor() {
        super();

        this.subscribe(pageModel.sourceText).redrawOnChange({ replace: true });
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

