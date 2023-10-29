class CsvExportService extends BaseExportService {
    constructor() {
        super('csv');
    }

    /**
     * @param {TaskModel[]} tasks
     * @returns {string}
     */
    _getContent(tasks) {
        const separator = ';';

        const header = `Title${separator}Duration in seconds${separator}Duration formatted`;

        const tasksString = tasks
            .map((task) => {
                return `${task.title}${separator}${task.durationInSeconds}${separator}${task.durationFormatted}`;
            })
            .join('\n');

        return [header, tasksString].join('\n');
    }
}

const csvExportService = new CsvExportService();
