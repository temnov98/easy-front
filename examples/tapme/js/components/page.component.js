class PageComponent extends Component {
    constructor() {
        super();

        this.activeTab = this.createFullRedrawable(this.pageFromLocation, 'activeTab');
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
        };

        const component = pageMapping[this.activeTab] || TrackerPageComponent;

        return t`
            <div>
                ${new TabPanelComponent({
                    tabs: ['tracker', 'chart'],
                    activeTab: this.activeTab,
                    onSelect: (title) => this.onSelect(title),
                })}
                ${component}
            </div>
        `;
    }
}
