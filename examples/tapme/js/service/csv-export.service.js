class CsvExportService {
    /**
     * @param {TaskModel[]} tasks
     * @returns {void}
     */
    export(tasks) {
        // Create element with <a> tag
        const link = document.createElement("a");

        // Create a blog object with the file content which you want to add to the file
        const file = new Blob([this._getContent(tasks)], { type: 'text/plain' });

        // Add file content in the object URL
        link.href = URL.createObjectURL(file);

        // Add file name
        link.download = this._getFilename();

        // Add click event to <a> tag to save file.
        link.click();
        URL.revokeObjectURL(link.href);
    }

    /**
     * @returns {string}
     */
    _getFilename() {
        const date = new Date();

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${day}-${month}-${year} ${hours}-${minutes}.tapme.csv`;
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
