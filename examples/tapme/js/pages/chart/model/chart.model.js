class ChartModel extends BaseModel {
    constructor() {
        super();

        const { days } = chartStorageService.load();

        this.days = this.createObservable(days ?? [], 'days');

        this.allTags = [];
        this.activeTags = this.createObservable(new Set(), 'activeTags');

        this._refreshConstants();
    }

    /**
     * @param {string} tag
     * @param {boolean} checked
     */
    toggleTag(tag, checked) {
        if (checked) {
            chartModel.activeTags.add(tag);
        } else {
            chartModel.activeTags.delete(tag);
        }

        // NOTE: for notify subscribers
        chartModel.activeTags = chartModel.activeTags;
    }

    clearChart() {
        this.days = [];

        this._refreshConstants();
        this._saveToStorage();
    }

    async selectFiles() {
        const handles = await window.showOpenFilePicker({
            multiple: true,
            types: [
                {
                    description: 'JSON Files',
                    accept: {
                        'application/json': ['.tapme.json'],
                        'text/csv': ['.tapme.csv'],
                    },
                },
            ],
        });

        const files = await Promise.all(handles.map((handle) => handle.getFile()));
        const filesContents = await Promise.all(files.map((file) => file.text()));

        this.days = ChartFileReaderService.readFiles({ files, filesContents });
        this._refreshConstants();
        this._saveToStorage();
    }

    _refreshConstants() {
        this.days.sort((left, right) => left.date.getTime() - right.date.getTime());
        this.allTags = [...new Set(this.days.map((day) => day.tasks.map((task) => task.tags)).flat(2))];
        this.activeTags = new Set(this.allTags);
    }

    _saveToStorage() {
        chartStorageService.save({
            days: this.days,
        });
    }
}

const chartModel = new ChartModel();
