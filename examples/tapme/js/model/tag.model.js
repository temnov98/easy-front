class TagModel {
    /**
     * @param {object} params
     * @param {string} [params.id]
     * @param {string} params.title
     * @param {string} params.color
     */
    constructor({ id, title, color }) {
        this.id = id ?? getId();
        this.title = title;
        this.color = color;
    }
}
