const updatesList = Object.entries(locales.whatsNew)
  .sort(([id1], [id2]) => id2 > id1 ? 1 : -1)
  .filter(([id, _]) => id[0] === '_')
  .map(([id, content], index) => {
    return {id: index + 1, content};
  })

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
