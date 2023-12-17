class TabsModel extends BaseModel {
    constructor() {
        super();

        this.activeTabKey = this.createObservable(this._getPageFromLocation(), 'activeTabKey');
    }

    /**
     * @param {string} page
     */
    changePage(page) {
        const url = window.location.href;
        const clearUrl = url.split('?')[0];

        history.replaceState(null, null, `${clearUrl}?page=${page}`);

        this.activeTabKey = page;
    }

    _getPageFromLocation() {
        try {
            return window.location.href.split('?')[1].split('=')[1];
        } catch (e) {
            return 'tracker';
        }
    }
}

const tabsModel = new TabsModel();
