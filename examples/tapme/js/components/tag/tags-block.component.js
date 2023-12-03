class TagsBlockComponent extends Component {
    /**
     * @param {TaskModel | PresetModel} model
     */
    constructor(model) {
        super();

        this.model = model;
    }

    toHtml() {
        return t`
            <table class="tags-block">
                <tr>
                    <td>
                        ${this.model.tags.map((tag) => new TagComponent({ model: this.model, tag }))}
                        ${new AddTagComponent({
                            model: this.model,
                            buttonContainerCssClassName: 'add-tag-button',
                            inputContainerCssClassName: 'tag-item-textbox',
                        })}
                    </td>
                </tr>
            </table>
        `;
    }
}
