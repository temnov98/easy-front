class DatalistTagsComponent extends AutoSubscribeComponent {

    /**
     * @param {object} params
     * @param {TaskModel | PresetModel} [params.model]
     * @param {string} params.dataId
     */
    constructor({model, dataId}) {
        super();
        this.model = model;
        this.subscribe(model.tags);
        this.subscribe(trackerPageModel.tags);

        this.dataId = dataId;
    }

    toHtml() {
        if (!this.model) {
            return '';
        }

        return t`
            <datalist id=${this.dataId} role="listbox">
                ${trackerPageModel?.tags
                    .filter((el) =>  !this.model.tags.find(setTag => setTag.title === el.title))
                    .map((tag) => new OptionComponent(tag))
                }
            </datalist>
        `;
    }
}

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