class LettersBlockComponent extends Component {
    toHtml() {
        return t`
            <fieldset class="letter-block">
                <legend>Choose letters:</legend>
                ${pageModel.letters.map((item) => new LetterComponent(item))}
            </fieldset>
        `;
    }
}

