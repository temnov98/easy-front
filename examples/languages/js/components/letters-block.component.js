class LettersBlockComponent extends Component {
    constructor() {
        super();

        this.subscribe(pageModel.letters).redrawOnChange({ replace: true });
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

