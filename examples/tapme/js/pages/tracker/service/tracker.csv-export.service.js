class TrackerCsvExportService extends TrackerBaseExportService {
    constructor() {
        super('csv');
    }

    /**
     * @param {TaskModel[]} tasks
     * @returns {string}
     */
    _getContent(tasks) {
        const separator = ';';

        const headerColumns = ['Title', 'Duration in seconds', 'Duration formatted', 'Tags'];
        const header = headerColumns.join(separator);

        const tasksString = tasks
            .map((task) => {
                const columns = [
                    task.title,
                    task.durationInSeconds,
                    task.durationFormatted,
                    task.tags.map((tag) => tag.title).join(','),
                ];

                return columns.join(separator);
            })
            .join('\n');

        return [header, tasksString].join('\n');
    }
}

const trackerCsvExportService = new TrackerCsvExportService();
