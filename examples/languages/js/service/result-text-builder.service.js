class ResultTextBuilderService {
    /**
     * @param {object} params
     * @param {string} params.sourceText
     * @param {{ selected: boolean; replaceFrom: string; foreign: string }[]} params.letters
     * @param {Map<string, string[]>} params.replaceFromToLetters
     * @param {boolean} params.boldForReplaced
     * @param {boolean} params.colorForReplaced
     * @return {string}
     */
    static getResultHtml({ sourceText, letters, replaceFromToLetters, colorForReplaced, boldForReplaced }) {
        let preparedText = sourceText.toLowerCase();

        letters
            .filter((letter) => letter.selected && letter.replaceFrom.length > 1)
            .forEach((letter) => {
                const replaceValue = this._formatLetter({
                    letter: letter.foreign,
                    colorForReplaced,
                    boldForReplaced,
                });

                preparedText = preparedText.replaceAll(letter.replaceFrom, replaceValue);
            });

        return preparedText
            .split('')
            .map((letter) => {
                const currentLetters = (replaceFromToLetters.get(letter) ?? []).filter((letter) => letter.selected);
                if (!currentLetters.length) {
                    return letter;
                }

                const index = Math.floor(Math.random() * currentLetters.length);

                const result = currentLetters[index].foreign;

                return this._formatLetter({
                    letter: result,
                    boldForReplaced,
                    colorForReplaced,
                });
            })
            .join('')
            .replaceAll('\n', '<br>');
    }

    /**
     * @param {object} params
     * @param {string} params.letter
     * @param {boolean} params.boldForReplaced
     * @param {boolean} params.colorForReplaced
     * @return {string}
     */
    static _formatLetter({ letter, boldForReplaced, colorForReplaced }) {
        if (boldForReplaced && colorForReplaced) {
            return `<b style="color: red">${letter}</b>`;
        } else if (boldForReplaced) {
            return `<b>${letter}</b>`;
        } else if (colorForReplaced) {
            return `<span style="color: red">${letter}</span>`;
        } else {
            return letter;
        }
    }
}
