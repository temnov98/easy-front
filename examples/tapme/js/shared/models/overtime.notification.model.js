// todo: не нравится тут зависимость от trackerPageModel
class OvertimeNotificationModel extends BaseModel {
    constructor() {
        super();

        this.showIntervalInMilliseconds = 10 * 60 * 60 * 1000;
        this.checkIntervalInMilliseconds = 5 * 60 * 1000;
        // TODO: Брать на основе среднего рабочего времени, если таких дней более 10
        this.overtimeTresholdInMilliseconds = 6 * 60 * 60 * 1000;

        this.lastShowedDateStorageKey = 'time-tracker-local-storage-key:overtime-notification:last-showed-date';

        this.shouldNotify = this.createObservable(this._getShouldNotify(), 'shouldNotify');
        this.isOvertime = this.createObservable(this.getIsOvertime(), 'isOvertime');

        setInterval(() => {
            this.isOvertime = this.getIsOvertime();
            this.shouldNotify = this._getShouldNotify();
        }, this.checkIntervalInMilliseconds);
    }

    openNotificationModalWindow() {
        if (this.shouldNotify) {
            this.markAsViewed();
        }

        // TODO: Сделать нормальное модальное окно с локализаций
        alert('You work too much');
    }

    markAsViewed() {
        try {
            localStorage.setItem(this.lastShowedDateStorageKey, new Date().toISOString());

            this.shouldNotify = false;
        } catch (e) {}
    }

    getIsOvertime() {
        return (trackerPageModel.getTotalTimeInSeconds() * 1000) > this.overtimeTresholdInMilliseconds;
    }

    // todo: плохо написал.
    //  оно будет висеть 5 минут, если нет активной задачи, а должно обновляться мгновенно.
    //  при исправлении важно учесть, чтобы не было циклических зависимостей
    _getShouldNotify() {
        if (!this.getIsOvertime()) {
            return false;
        }

        const hasActiveTask = trackerPageModel.hasActiveTask();

        const lastShowedDate = this._loadLastShowedDate();
        if (!lastShowedDate) {
            return hasActiveTask;
        }

        const diff = Date.now() - lastShowedDate.getTime();

        return diff > this.showIntervalInMilliseconds && hasActiveTask;
    }

    /**
     * @return {undefined|Date}
     * @private
     */
    _loadLastShowedDate() {
        try {
            const result = localStorage.getItem(this.lastShowedDateStorageKey);
            if (!result) {
                return undefined;
            }

            return new Date(result);
        } catch (e) {
            return undefined;
        }
    }
}

const overtimeNotificationModel = new OvertimeNotificationModel();
