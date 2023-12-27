const updatesList = [
    {
        id: 4,
        content: {
            date: 'Dec 28, 2023',
            lines: [
                'Improve tasks and templates moving',
            ],
        },
    },
    {
        id: 3,
        content: {
            date: 'Dec 21, 2023',
            lines: [
                'Tasks and templates can now be moved! Drag the green bar to the left of the line.',
                `Added 'What's new?'`,
            ],
        },
    },
    {
        id: 2,
        content: {
            date: 'Oct 8, 2023',
            lines: [
                'Added dark theme.',
            ],
        },
    },
    {
        id: 1,
        content: {
            date: 'March 6, 2023',
            lines: [
                'Release of time tracker.',
            ],
        },
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
