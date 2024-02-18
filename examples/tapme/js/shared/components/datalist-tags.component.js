class OptionComponent extends Component {
    /**
     * @param {TagModel} tag
     */
    constructor(tag) {
        super();

        this.tag = tag;
    }

    toHtml() {
        return t`
            <option value="${this.tag.title}">${this.tag.title}</option>
        `;
    }
}

class DatalistTagsComponent extends Component {
    /**
     * @param {object} params
     * @param {TaskModel | PresetModel | TrackerPageModel} params.model
     * @param {string} params.dataId
     */
    constructor({ model, dataId }) {
        super();

        this.model = model;
        this.dataId = dataId;
    }

    toHtml() {
        const options = trackerPageModel.tags
            .filter((el) => !this.model.tags.some((setTag) => trackerPageModel.tagsEqual(setTag, el)))
            .map((tag) => new OptionComponent(tag));

        return t`
            <datalist id=${this.dataId} role="listbox">
                ${options}
            </datalist>
        `;
    }
}
