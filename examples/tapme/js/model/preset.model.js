class PresetModel extends BaseModel {
    /**
     * @param {object} params
     * @param {string} [params.id]
     * @param {string} params.title
     * @param {TagModel[]} [params.tags]
     */
    constructor({ id, title, tags }) {
        super();

        this.id = id ?? getId();
        this.title = title;
        this.tags = this.createObservable(tags ?? [], 'tags');
    }
}
