class TagItemColorComponent extends AutoSubscribeComponent {
    /**
     * @param {TagModel} tag
     */
    constructor(tag) {
        super();

        this.tag = tag;
        this.inputId = getId();
    }

    get input() {
        return document.getElementById(this.inputId);
    }

    onChangeColor() {
        const value = this.input.value;

        trackerPageModel.changeTagColor(this.tag, value);
    }

    toHtml() {
        return t`
            <input
                class="tag-item-component-input"
                id="${this.inputId}"
                type="color"
                value="${this.tag.color}"
                onchange="${() => this.onChangeColor()}"
            />
        `;
    }
}

class TagItemComponent extends Component {
    /**
     * @param {TagModel} tag
     */
    constructor(tag) {
        super();

        this.tag = tag;
    }

    toHtml() {
        return t`
            <div class="row tag-item-component-container">
                <div class="hide-by-default selected-row"></div>
                ${new TagItemColorComponent(this.tag)}
                ${new TagItemTextComponent(this.tag)}
                ${new DeleteButtonComponent(() => trackerPageModel.deleteTag(trackerPageModel, this.tag))}
            </div>
        `;
    }
}
