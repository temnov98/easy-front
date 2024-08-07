class TrackerPageInnerComponent extends Component {
    constructor() {
        super();

        this.cssClass = new CssClass(this.cssClassName);

        this.subscribe(trackerPageModel.tagsSettingsOpened).onChange(() => {
            this.cssClass.className = this.cssClassName;
        });
    }

    get cssClassName() {
        const additional = trackerPageModel.tagsSettingsOpened ? 'page-tags-settings-expanded' : 'page-tags-settings-hided';

        return `page ${additional}`;
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
            <div class="tracker-page">
                ${TrackerPageInnerComponent}
                ${TagsSettingsPanelComponent}
                ${UpdatesNotifierComponent}
                ${TrackerSettingsButtonComponent}
                ${OvertimeNotificationComponent}
            </div>
        `;
    }
}
