const updatesList = [
    {
        id: 7,
        content: locales.whatsNew._7,
    },
    {
        id: 6,
        content: locales.whatsNew._6,
    },
    {
        id: 5,
        content: locales.whatsNew._5,
    },
    {
        id: 4,
        content: locales.whatsNew._4,
    },
    {
        id: 3,
        content: locales.whatsNew._3,
    },
    {
        id: 2,
        content: locales.whatsNew._2,
    },
    {
        id: 1,
        content: locales.whatsNew._1,
    },
];

class UpdatesModel extends BaseModel {
    constructor() {
        super();

        this.lastShowedIdStorageKey = 'time-tracker-local-storage-key:updates:last-showed-id';

        const hasNews = this._loadLastShowedId() !== this._lastUpdatesId;

        this.hasNews = this.createObservable(hasNews, 'hasNews');
    }

    openUpdatesModalWindow() {
        this.markAsViewed();

        modalWindowModel.openModal('UpdatesModalWindowComponent');
    }

    markAsViewed() {
        try {
            localStorage.setItem(this.lastShowedIdStorageKey, this._lastUpdatesId.toString());

            this.hasNews = false;
        } catch (e) {}
    }

    get _lastUpdatesId() {
        return Math.max(...updatesList.map((item) => item.id));
    }

    _loadLastShowedId() {
        try {
            const result = localStorage.getItem(this.lastShowedIdStorageKey);
            if (!result) {
                return 0;
            }

            return +result;
        } catch (e) {
            return false;
        }
    }
}

const updatesModel = new UpdatesModel();
