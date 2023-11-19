class PageModel extends BaseModel {
    constructor() {
        super();

        this.language = this.createObservable('georgian', 'language');
        this.sourceText = this.createObservable('', 'sourceText');
        this.boldForReplaced = this.createObservable(false, 'boldForReplaced');
        this.colorForReplaced = this.createObservable(false, 'colorForReplaced');
        this.letters = this.createObservable([], 'letters');
        this.resultText = this.createObservable('', 'resultText');

        this.replaceFromToLetters = new Map();

        this._refreshLanguage();
    }

    toggleLanguage() {
        this.language = this.language === 'georgian' ? 'english' : 'georgian';

        this._refreshLanguage();
    }

    _refreshLanguage() {
        const newLetters = this.language === 'georgian' ? georgianLetters : englishLetters;

        this.letters = newLetters.map((item) => new LetterModel({
            selected: false,
            description: item.description,
            foreign: item.foreign,
            replaceFrom: item.replaceFrom,
        }));

        this.replaceFromToLetters.clear();

        for (const letter of this.letters) {
            const currentLetters = this.replaceFromToLetters.get(letter.replaceFrom);

            if (currentLetters) {
                currentLetters.push(letter);
            } else {
                this.replaceFromToLetters.set(letter.replaceFrom, [letter]);
            }
        }

        this.unselectAll();
        this.updateResultText();
    }

    selectAll() {
        this.letters.forEach((letter) => letter.selected = true);
        this.updateResultText();
    }

    unselectAll() {
        this.letters.forEach((letter) => letter.selected = false);
        this.updateResultText();
    }

    toggleBold() {
        pageModel.boldForReplaced = !pageModel.boldForReplaced;
        this.updateResultText();
    }

    toggleColor() {
        pageModel.colorForReplaced = !pageModel.colorForReplaced;
        this.updateResultText();
    }

    setSourceText(sourceText) {
        this.sourceText = sourceText;
        this.updateResultText();
    }

    updateResultText() {
        this.resultText = ResultTextBuilderService.getResultHtml({
            sourceText: this.sourceText,
            letters: this.letters,
            replaceFromToLetters: this.replaceFromToLetters,
            boldForReplaced: this.boldForReplaced,
            colorForReplaced: this.colorForReplaced,
        });
    }
}

const pageModel = new PageModel();
