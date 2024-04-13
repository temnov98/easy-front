class TrackerBaseExportService {
    /**
     * @param {string} extension
     */
    constructor(extension) {
        this._extension = extension;
    }

    /**
     * @param {TaskModel[]} tasks
     * @returns {void}
     */
    export(tasks) {
        exportFile({
            content: this._getContent(tasks),
            filename: this._getFilename(),
        });
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

        return `${day}-${month}-${year} ${hours}-${minutes}.tapme.${this._extension}`;
    }

    /**
     * @param {TaskModel[]} tasks
     * @returns {string}
     */
    _getContent(tasks) {
        // Should be overridden
        return '';
    }
}
