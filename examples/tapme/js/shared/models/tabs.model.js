const AvailableTabs = {
    Tracker: 'tracker',
    Chart: 'chart',
    CheckLists: 'check-lists',
    Notifications: 'notifications',
};

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
            const result = window.location.href.split('?')[1].split('=')[1];

            if (Object.values(AvailableTabs).includes(result)) {
                return result;
            }

            return AvailableTabs.Tracker;
        } catch (e) {
            return AvailableTabs.Tracker;
        }
    }
}

const tabsModel = new TabsModel();
