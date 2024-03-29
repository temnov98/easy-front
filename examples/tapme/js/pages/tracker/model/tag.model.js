class TagModel extends BaseModel {
    /**
     * @param {object} params
     * @param {string} params.title
     * @param {string} params.color
     */
    constructor({ title, color }) {
        super();

        this.title = this.createObservable(title, 'title');
        this.color = this.createObservable(color, 'color');
    }
}
