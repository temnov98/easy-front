/**
 * @class PresetModel
 * @property {string} id
 * @property {string} title
 * @property {TagModel[]} tags
 */
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
        /** @type TagModel[] */
        this.tags = this.createObservable(tags ?? [], 'tags');
    }
}
