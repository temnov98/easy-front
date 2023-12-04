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

    toHtml() {
        const pageMapping = {
            'tracker': TrackerPageComponent,
            'chart': ChartPageComponent,
        };

        const component = pageMapping[this.activeTab] || TrackerPageComponent;

        return t`
            <div>
                ${component}
            </div>
        `;
    }
}
