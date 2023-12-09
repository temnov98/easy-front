class TrackerJsonExportService extends TrackerBaseExportService {
    constructor() {
        super('json');
    }

    /**
     * @param {TaskModel[]} tasks
     * @returns {string}
     */
    _getContent(tasks) {
        const result = {
            tasks: tasks.map((task) => ({
                title: task.title,
                duration: task.durationInMilliseconds,
                intervals: task.intervals.map((interval) => ({
                    startedAt: interval.startedAt.getTime(),
                    finishedAt: interval.finishedAt.getTime(),
                    duration: interval.durationInMilliseconds,
                })),
                tags: task.tags.map((tag) => tag.title),
            })),
        };

        return JSON.stringify(result, null, 2);
    }
}

const jsonExportService = new TrackerJsonExportService();
