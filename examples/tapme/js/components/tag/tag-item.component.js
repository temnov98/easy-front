class TagItemComponent extends AutoSubscribeComponent {
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

        pageModel.changeTagColor(this.tag, value);
    }

    toHtml() {
        return t`
            <div class="row">
                <input
                    class="tag-item-component-input"
                    id="${this.inputId}"
                    type="color"
                    value="${this.tag.color}"
                    onchange="${() => this.onChangeColor()}"
                />
                <div
                    class="tag-item-component-text"
                    style="background-color: ${this.tag.color}"
                    onclick="${() => pageModel.deleteTag(pageModel, this.tag)}"
                >
                    ${this.tag.title}
                </div>
            </div>
        `;
    }
}
