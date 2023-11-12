class PageModel extends BaseModel {
    constructor() {
        super();

        // TODO: georgianLetters should be passed from constructor
        this.letters = georgianLetters.map((item) => new LetterModel({
            selected: false,
            description: item.description,
            foreign: item.foreign,
            replaceFrom: item.replaceFrom,
        }));

        this.sourceText = this.createObservable('', 'sourceText');
        this.boldForReplaced = this.createObservable(false, 'boldForReplaced');
        this.colorForReplaced = this.createObservable(false, 'colorForReplaced');

        this.replaceFromToLetters = new Map();

        for (const letter of this.letters) {
            const currentLetters = this.replaceFromToLetters.get(letter.replaceFrom);

            if (currentLetters) {
                currentLetters.push(letter);
            } else {
                this.replaceFromToLetters.set(letter.replaceFrom, [letter]);
            }
        }
    }

    get resultHtml() {
        let preparedText = this.sourceText;

        this.letters
            .filter((letter) => letter.selected && letter.replaceFrom.length > 1)
            .forEach((letter) => {
                preparedText = preparedText.replaceAll(letter.replaceFrom, this._formatLetter(letter.foreign));
            });

        return preparedText
            .split('')
            .map((letter) => {
                const currentLetters = (this.replaceFromToLetters.get(letter) ?? []).filter((letter) => letter.selected);
                if (!currentLetters.length) {
                    return letter;
                }

                const index = Math.floor(Math.random() * currentLetters.length);

                const result = currentLetters[index].foreign;

                return this._formatLetter(result);
            })
            .join('')
            .replaceAll('\n', '<br>');
    }

    _formatLetter(letter) {
        if (this.boldForReplaced && this.colorForReplaced) {
            return `<b style="color: red">${letter}</b>`;
        } else if (this.boldForReplaced) {
            return `<b>${letter}</b>`;
        } else if (this.colorForReplaced) {
            return `<span style="color: red">${letter}</span>`;
        } else {
            return letter;
        }
    }

    selectAll() {
        this.letters.forEach((letter) => letter.selected = true);

        this.updateText();
    }

    unselectAll() {
        this.letters.forEach((letter) => letter.selected = false);

        this.updateText();
    }

    updateText() {
        this.sourceText = this.sourceText;
    }
}

const pageModel = new PageModel();
