// TODO: Нужно перестать ориентироваться на имена файлов

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

        /** @type {ChartDayModel[]} */
        const days = [];

        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            const content = filesContents[index];

            const extension = file.name.split('.').pop();
            const [day, month, year] = file.name.split(' ')[0].split('-');

            const date = new Date(`${year}-${month}-${day}`);

            if (extension === 'json') {
                days.push(this._jsonDataToDayModel(date, JSON.parse(content)));
            } else if (extension === 'csv') {
                days.push(this._csvDataToDayModel(date, content));
            }
        }

        return days;
    }

    /**
     * @param {Date} date
     * @param {object} data
     * @return {ChartDayModel}
     * @private
     */
    static _jsonDataToDayModel(date, data) {
        return new ChartDayModel({
            date,
            tasks: data.tasks.map((task) => new ChartTaskModel({
                tags: task.tags,
                seconds: task.duration / 1000,
            })),
            intervals: this._jsonDataToDayIntervalModels(data),
        })
    }

    /**
     * @param {object} data
     * @return {ChartIntervalModel[]}
     * @private
     */
    static _jsonDataToDayIntervalModels(data) {
        return data.tasks
            .reduce((acc, task) => {
                if (!task.intervals) {
                    return acc;
                }

                const taskIntervals = task.intervals.map((interval) => new ChartIntervalModel({
                    title: task.title,
                    start: new Date(interval.startedAt),
                    end: new Date(interval.finishedAt),
                    tags: task.tags ?? [],
                }));

                return [...acc, ...taskIntervals];
            }, [])
            .sort((left, right) => left.end.getTime() - right.end.getTime());
    }

    /**
     * @param {Date} date
     * @param {string} data
     * @return {ChartDayModel}
     * @private
     */
    static _csvDataToDayModel(date, data) {
        const lines = data.split('\n').filter((line, index) => index !== 0 && !!line.length);

        const tasks = [];

        for (const line of lines) {
            const [title, seconds, formatted, tags] = line.split(';');

            tasks.push(new ChartTaskModel({
                tags: tags ? tags.split(',') : undefined,
                seconds: +seconds,
            }));
        }

        return new ChartDayModel({
            date,
            tasks,
            intervals: [], // There are no intervals in csv files
        });
    }
}
