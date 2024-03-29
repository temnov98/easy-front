class TagsSettingsPanelComponent extends AutoSubscribeComponent {
    constructor() {
        super();

        this.cssClass = new CssClass(this.cssClassName);

        this.subscribe(trackerPageModel.tagsSettingsOpened).onChange(() => {
            this.cssClass.className = this.cssClassName;
        });
    }

    get cssClassName() {
        return trackerPageModel.tagsSettingsOpened
            ? 'tags-settings-panel tags-settings-panel-active'
            : 'tags-settings-panel tags-settings-panel-inactive';
    }

    toHtml() {
        const list = new MovableListComponent({
            items: trackerPageModel.tags.map((tag) => new TagItemComponent(tag)),
            checkAvailability: (target) => target.className.includes('selected-row'),
            onChange: ({ from, to }) => trackerPageModel.moveTags({ from, to }),
            disableRedrawOnChange: true,
        });

        return t`
            <div class="${this.cssClass}">
                <div class="tags-settings-panel-inner">
                    ${list}
                    ${new AddTagComponent({
                        model: trackerPageModel,
                        buttonContainerCssClassName: 'tags-settings-add-tag-button',
                        inputContainerCssClassName: 'tags-settings-tag-item-textbox',
                        hideButtonByDefault: false,
                    })}
                </div>
            </div>
        `;
    }
}
