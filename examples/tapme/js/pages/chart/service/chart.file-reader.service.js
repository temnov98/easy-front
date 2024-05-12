/**
 * @typedef {Object} Interval
 * @property {Date} day
 * @property {string} task
 * @property {string[]} tags
 * @property {Date} startedAt
 * @property {Date} finishedAt
 */

class ChartFileReaderService {
    /**
     * @return {Promise<ChartDayModel[]>}
     */
    static async readFiles() {
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

        /** @type {Interval[]} */
        const intervals = [];

        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            const content = filesContents[index];

            const extension = file.name.split('.').pop();
            const [day, month, year] = file.name.split(' ')[0].split('-');

            const date = new Date(`${year}-${month}-${day}`);

            if (extension === 'json') {
                intervals.push(...this._jsonDataToIntervals(JSON.parse(content)));
            } else if (extension === 'csv') {
                intervals.push(...this._csvDataToIntervals(date, content));
            }
        }

        return this._intervalsToDays(intervals);
    }

    /**
     * @param {Interval[]} intervals
     * @return {ChartDayModel[]}
     * @private
     */
    static _intervalsToDays(intervals) {
        if (!intervals.length) {
            return [];
        }

        /** @type {ChartDayModel[]} */
        const result = [];

        /** @type {Set<number>} */
        const days = new Set();
        /** @type {Map<number, ChartIntervalModel[]>} */
        const dayToChartIntervals = new Map();
        /** @type {Map<number, { title: string; tags: string[]; duration: number }[]>} */
        const dayToTasks = new Map();

        for (const interval of intervals) {
            const dayTimestamp = interval.day.getTime();

            days.add(dayTimestamp);

            const chartIntervalModel = new ChartIntervalModel({
                tags: interval.tags,
                title: interval.task,
                start: interval.startedAt,
                end: interval.finishedAt,
            });

            const chartIntervals = dayToChartIntervals.get(dayTimestamp);
            if (chartIntervals) {
                chartIntervals.push(chartIntervalModel);
            } else {
                dayToChartIntervals.set(dayTimestamp, [chartIntervalModel]);
            }

            const duration = interval.finishedAt.getTime() - interval.startedAt.getTime();

            const tasks = dayToTasks.get(dayTimestamp);
            const task = (tasks ?? []).find((item) => item.title === interval.task);

            if (task) {
                task.duration += duration;
            } else {
                const newTask = {
                    title: interval.task,
                    tags: interval.tags,
                    duration,
                };

                if (tasks) {
                    tasks.push(newTask);
                } else {
                    dayToTasks.set(dayTimestamp, [newTask]);
                }
            }
        }

        const sortedDays = [...days].sort((left, right) => left - right);

        for (const dayTimestamp of sortedDays) {
            const intervals = dayToChartIntervals.get(dayTimestamp) ?? [];

            result.push(new ChartDayModel({
                date: new Date(dayTimestamp),
                tasks: (dayToTasks.get(dayTimestamp) ?? []).map((item) => new ChartTaskModel({
                    tags: item.tags,
                    seconds: item.duration / 1000,
                })),
                intervals: intervals.sort((left, right) => left.start.getTime() - right.start.getTime()),
            }));
        }

        return result;
    }

    /**
     * @param {object} data
     * @return {Interval[]}
     * @private
     */
    static _jsonDataToIntervals(data) {
        /** @type {Interval[]} */
        const result = [];

        for (const task of data.tasks) {
            for (const taskInterval of task.intervals) {
                const intervals = this._splitIntervals({
                    startedAt: new Date(taskInterval.startedAt),
                    finishedAt: new Date(taskInterval.finishedAt),
                });

                for (const { day, startedAt, finishedAt} of intervals) {
                    result.push({
                        day,
                        task: task.title,
                        tags: task.tags.map((tag) => tag),
                        startedAt,
                        finishedAt,
                    });
                }
            }
        }

        return result;
    }

    /**
     * @param {Date} startedAt
     * @param {Date} finishedAt
     * @return {{ day: Date; startedAt: Date; finishedAt: Date; duration: number }[]}
     * @private
     */
    static _splitIntervals({ startedAt, finishedAt }) {
        if (startedAt.getTime() >= finishedAt.getTime()) {
            return [];
        }

        const startedAtDayStart = new Date(startedAt).setHours(0, 0, 0, 0);
        const finishedAtDayStart = new Date(finishedAt).setHours(0, 0, 0, 0);

        if (startedAtDayStart === finishedAtDayStart) {
            return [
                {
                    day: new Date(startedAtDayStart),
                    startedAt,
                    finishedAt,
                    duration: finishedAt.getTime() - startedAt.getTime(),
                },
            ];
        }

        const dayDuration = 24 * 60 * 60 * 1000;
        const startedAtDayEnd = new Date(startedAtDayStart + dayDuration);
        let currentDateStart = startedAtDayStart + dayDuration;

        /** @type {{ day: Date; startedAt: Date; finishedAt: Date; duration: number }[]} */
        const result = [
            {
                day: new Date(startedAtDayStart),
                startedAt,
                finishedAt: startedAtDayEnd,
                duration: startedAtDayEnd.getTime() - startedAt.getTime(),
            },
        ];

        while (currentDateStart < finishedAtDayStart) {
            result.push({
                day: new Date(currentDateStart),
                startedAt: new Date(currentDateStart),
                finishedAt: new Date(currentDateStart + dayDuration),
                duration: dayDuration,
            });

            currentDateStart += dayDuration;
        }

        result.push({
            day: new Date(finishedAtDayStart),
            startedAt: new Date(finishedAtDayStart),
            finishedAt,
            duration: finishedAt.getTime() - finishedAtDayStart,
        });

        return result;
    }

    /**
     * @param {Date} date
     * @param {string} data
     * @return {Interval[]}
     * @private
     */
    static _csvDataToIntervals(date, data) {
        const lines = data.split('\n').filter((line, index) => index !== 0 && !!line.length);

        const dayTimestamp = new Date(date).setHours(0, 0, 0, 0);
        const day = new Date(dayTimestamp);
        let startedAtTimestamp = dayTimestamp;

        /** @type {Interval[]} */
        const intervals = [];

        for (const line of lines) {
            const [title, seconds, formatted, tags] = line.split(';');

            const finishedAt = new Date(startedAtTimestamp + (+seconds) * 1000);

            intervals.push({
                day,
                task: title,
                tags: tags ? tags.split(',') : undefined,
                startedAt: new Date(startedAtTimestamp),
                finishedAt,
            });

            startedAtTimestamp = finishedAt.getTime();
        }

        return intervals;
    }
}
