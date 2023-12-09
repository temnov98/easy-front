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
                 onclick="${() => trackerPageModel.deleteTag(this.model, this.tag)}"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="trash_24">
                        <path id="Vector" d="M17 6H22V8H20V21C20 21.2652 19.8946 21.5196 19.7071 21.7071C19.5196 21.8946 19.2652 22 19 22H5C4.73478 22 4.48043 21.8946 4.29289 21.7071C4.10536 21.5196 4 21.2652 4 21V8H2V6H7V3C7 2.73478 7.10536 2.48043 7.29289 2.29289C7.48043 2.10536 7.73478 2 8 2H16C16.2652 2 16.5196 2.10536 16.7071 2.29289C16.8946 2.48043 17 2.73478 17 3V6ZM18 8H6V20H18V8ZM9 4V6H15V4H9Z" />
                    </g>
                </svg>

                <div class="tag-item-title">
                    ${this.tag.title}
                </div>
            </div>
        `;
    }
}
