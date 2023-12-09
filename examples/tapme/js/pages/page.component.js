class PageComponent extends Component {
    constructor() {
        super();

        this.activeTab = this.createFullRedrawable(this.pageFromLocation, 'activeTab');

        this.cssClass = new CssClass(this.cssClassName);

        this.subscribe(themeModel.theme).onChange(() => {
            this.cssClass.className = this.cssClassName;
        });
    }

    get cssClassName() {
        return `page--${themeModel.theme}`;
    }

    get pageFromLocation() {
        try {
            return window.location.href.split('?')[1].split('=')[1];
        } catch (e) {
            return 'tracker';
        }
    }

    onSelect(page) {
        const url = window.location.href;
        const clearUrl = url.split('?')[0];

        history.replaceState(null, null, `${clearUrl}?page=${page}`);

        this.activeTab = page
    }

    toHtml() {
        const pageMapping = {
            'tracker': TrackerPageComponent,
            'chart': ChartPageComponent,
            'lists': CheckListPageComponent,
        };

        const component = pageMapping[this.activeTab] || TrackerPageComponent;

        return t`
            <div class="${this.cssClass}">
                ${new TabPanelComponent({
                    tabs: ['tracker', 'chart', 'lists'],
                    activeTab: this.activeTab,
                    onSelect: (title) => this.onSelect(title),
                })}
                ${SwitchThemeComponent}
                ${component}
                ${DebugComponent}
                ${ModalWindowComponent}
            </div>
        `;
    }
}
