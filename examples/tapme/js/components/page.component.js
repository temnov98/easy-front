class PageComponent extends Component {
    constructor() {
        super();

        this._subscriber = new Subscriber(() => {
            this.className = `"page page--${pageModel.theme.value}"`
        });
        pageModel.theme.connect(this._subscriber);

        this.className = this.createFullRedrawable(`"page page--${pageModel.theme.value}"`, 'className');
    }

    toHtml() {
        return t`
            <div id="main-content" class=${this.className}>
                ${HeaderComponent}
                ${TasksListComponent}
                ${ButtonsLineComponent}
                ${PresetsListComponent}
            </div>
            ${DebugComponent}
        `;
    }
}
