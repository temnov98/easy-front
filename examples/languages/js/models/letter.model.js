class LetterModel extends BaseModel {
    /**
     * @param {object} params
     * @param {string} params.foreign
     * @param {string} params.replaceFrom
     * @param {string} params.description
     * @param {boolean} params.selected
     */
    constructor({ foreign, replaceFrom, description, selected = false }) {
        super();

        this.foreign = foreign;
        this.replaceFrom = replaceFrom;
        this.description = description;

        this.selected = this.createObservable(selected, 'selected');
    }
}
