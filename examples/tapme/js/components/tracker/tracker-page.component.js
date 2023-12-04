class TrackerPageInnerComponent extends Component {
    constructor() {
        super();

        this.cssClass = new CssClass(this.cssClassName);

        this.subscribe(pageModel.theme).onChange(() => {
            this.cssClass.className = this.cssClassName;
        });

        this.subscribe(pageModel.tagsSettingsOpened).onChange(() => {
            this.cssClass.className = this.cssClassName;
        });
    }

    get cssClassName() {
        const additional = pageModel.tagsSettingsOpened ? 'page-tags-settings-expanded' : 'page-tags-settings-hided';

        return `page page--${pageModel.theme} ${additional}`;
    }

    toHtml() {
        return t`
            <div class="${this.cssClass}">
                ${HeaderComponent}
                ${TasksListComponent}
                ${ButtonsLineComponent}
                ${PresetsListComponent}
            </div>
        `;
    }
}

class TrackerPageComponent extends Component {
    toHtml() {
        return t`
            <div>
                ${TrackerPageInnerComponent}
                ${SwitchThemeComponent}
                ${DebugComponent}
                ${TagsSettingsPanelComponent}
                ${ModalWindowComponent}
            </div>
        `;
    }
}
