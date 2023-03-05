class PresetModel {
    /**
     * @param {object} params
     * @param {string} [params.id]
     * @param {string} params.title
     */
    constructor({ id, title }) {
        this.id = id ?? getId();
        this.title = title;
    }
}
