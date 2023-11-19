class LettersBlockComponent extends AutoSubscribeComponent {
    toHtml() {
        return t`
            <fieldset class="letter-block">
                <legend>Choose letters:</legend>
                ${pageModel.letters.map((item) => new LetterComponent(item))}
            </fieldset>
        `;
    }
}

