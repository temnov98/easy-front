class TagsSettingsPanelComponent extends AutoSubscribeComponent {
    constructor() {
        super();

        this.cssClass = new CssClass(this.cssClassName);

        this.subscribe(pageModel.tagsSettingsOpened).onChange(() => {
            this.cssClass.className = this.cssClassName;
        });
    }

    get cssClassName() {
        return pageModel.tagsSettingsOpened
            ? 'tags-settings-panel tags-settings-panel-active'
            : 'tags-settings-panel tags-settings-panel-inactive';
    }

    toHtml() {
        return t`
            <div class="${this.cssClass}">
                <div class="tags-settings-panel-inner">
                    ${pageModel.tags.map((tag) => new TagItemComponent(tag))}
                     ${new AddTagComponent({
                         model: pageModel,
                         buttonContainerCssClassName: 'tags-settings-add-tag-button',
                         inputContainerCssClassName: 'tags-settings-tag-item-textbox',
                         hideButtonByDefault: false,
                     })}
                </div>
            </div>
        `;
    }
}
