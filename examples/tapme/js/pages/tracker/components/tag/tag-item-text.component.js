class TagItemTextComponent extends AutoSubscribeComponent {
    /**
     * @param {TagModel} tag
     */
    constructor(tag) {
        super();

        this.tag = tag;
        this.inputId = getId();
    }

    get element() {
        return document.getElementById(this.inputId);
    }

    get inputValue() {
        if (!this.element) {
            return undefined;
        }

        return this.element.value.trim();
    }

    onKeyDown(event) {
        if (!event) {
            return;
        }

        if (event.key === 'Enter') {
            if (!this.inputValue) {
                this.element.value = this.tag.title;
                this.element.blur();

                return;
            }

            const changeTitleResult = trackerPageModel.changeTagTitle(this.tag, this.inputValue);
            if (!changeTitleResult) {
                this.element.value = this.tag.title;
                this.element.blur();

                return;
            }

            this.element.blur();
        }

        if (event.key === 'Escape') {
            this.element.value = this.tag.title;
            this.element.blur();
        }
    }

    onFocusOut() {
        this.element.value = this.tag.title;
    }

    toHtml() {
        return t`
            <input
                id="${this.inputId}"
                style="background-color: ${this.tag.color}"
                class="tag-item-component-text ym-disable-keys"
                onblur="${() => this.onFocusOut()}"
                onkeydown="${(event) => this.onKeyDown(event)}"
                value="${this.tag.title}"
            />
        `;
    }
}
