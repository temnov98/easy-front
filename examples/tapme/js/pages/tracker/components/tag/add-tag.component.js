class AddTagComponent extends Component {
    /**
     * @param {object} params
     * @param {TaskModel | PresetModel | TrackerPageModel} params.model
     * @param {string} params.buttonContainerCssClassName
     * @param {string} params.inputContainerCssClassName
     * @param {boolean} params.hideButtonByDefault
     */
    constructor({ model, buttonContainerCssClassName, inputContainerCssClassName, hideButtonByDefault }) {
        super();

        this.inputId = getId();
        this.model = model;
        this.buttonContainerCssClassName = buttonContainerCssClassName;
        this.inputContainerCssClassName = inputContainerCssClassName;
        this.hideButtonByDefault = hideButtonByDefault;
        this.clicked = this.createFullRedrawable(false, 'clicked');
        this.dataListId = getId();
    }

    get input() {
        return document.getElementById(this.inputId);
    }

    onClick() {
        this.clicked = true;

        this.input.focus();
    }

    onKeyDown(event) {
        if (!event) {
            return;
        }

        if (event.key === 'Enter') {
            event.preventDefault();

            const value = this.input.value.replaceAll('&nbsp;', '').trim();

            if (!value) {
                this.input.blur();

                return;
            }

            const tagAdded = trackerPageModel.addTag(this.model, value);
            if (!tagAdded) {
                this.input.blur();
            }
        }

        if (event.key === 'Escape') {
            this.input.blur();
        }
    }

    onFocusOut() {
        this.clicked = false;
    }

    toHtml() {
        if (this.clicked) {
            const tagsCount = this.model.tags.length;

            const className = tagsCount ? 'add-tag-input add-tag-input-not-empty' : 'add-tag-input add-tag-input-empty';

            return t`
                <div class="${this.inputContainerCssClassName}">
                    <input
                        autocomplete="off"
                        type="text"
                        role="combobox"
                        list=${this.dataListId}
                        class="${className}"
                        id="${this.inputId}"
                        onkeydown="${(event) => this.onKeyDown(event)}"
                        onfocusout="${() => this.onFocusOut()}"
                    />
                    ${new DatalistTagsComponent({model: this.model, dataId: this.dataListId})}
                </div>
            `;
        }

        const className = [
            this.buttonContainerCssClassName,
            'add-tag-button-svg',
            this.hideButtonByDefault ? 'hide-by-default' : '',
        ].join(' ');

        return t`
            <div class="${className}">
                 <svg
                     onclick="${() => this.onClick()}"
                     width="40px"
                     height="40px"
                     viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                 >
                    <g id="Edit / Add_Row">
                    <path id="Vector" d="M3 14V15C3 16.1046 3.89543 17 5 17L19 17C20.1046 17 21 16.1046 21 15L21 13C21 11.8954 20.1046 11 19 11H13M10 8H7M7 8H4M7 8V5M7 8V11" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                </svg>
            </div>
        `;
    }
}
