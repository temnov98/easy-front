class TagComponent extends AutoSubscribeComponent {
    /**
     * @param {object} params
     * @param {TaskModel | PresetModel} params.model
     * @param {TagModel} params.tag
     */
    constructor({ model, tag }) {
        super();

        this.model = model;
        this.tag = tag;
    }

    toHtml() {
        return t`
            <div 
                 class="tag-item"
                 style="background-color: ${this.tag.color}"
                 onclick="${() => pageModel.deleteTag(this.model, this.tag)}"
            >
                ${this.tag.title}
            </div>
        `;
    }
}
