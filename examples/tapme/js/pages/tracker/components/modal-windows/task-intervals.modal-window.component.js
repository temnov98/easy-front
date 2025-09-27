class TaskIntervalsModalWindowComponent extends Component {
    /**
     * @param {{ task: TaskModel }} params
     */
    constructor({ task }) {
        super();

        this.task = task;
        this.dialogTitleId = getId();
        this.formId = getId();
        this.intervals = task._finishedIntervals.map((interval, index) => ({
            id: `${task.id}-${index}-${getId()}`,
            startedAt: this._formatDateForInput(interval.startedAt),
            finishedAt: this._formatDateForInput(interval.finishedAt),
            error: undefined,
        }));

        this.subscribe(languageModel.language).redrawOnChange();
    }

    _formatDateForInput(date) {
        if (!date) {
            return '';
        }

        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const day = `${date.getDate()}`.padStart(2, '0');
        const hours = `${date.getHours()}`.padStart(2, '0');
        const minutes = `${date.getMinutes()}`.padStart(2, '0');
        const seconds = `${date.getSeconds()}`.padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }

    _parseDate(value) {
        if (!value) {
            return undefined;
        }

        const date = new Date(value);

        return Number.isNaN(date.getTime()) ? undefined : date;
    }

    onIntervalChange(intervalId, field, value) {
        const interval = this.intervals.find((item) => item.id === intervalId);
        if (!interval) {
            return;
        }

        interval[field] = value;
        interval.error = undefined;

        this._validateInterval(interval);

        this.redraw();
    }

    _validateInterval(interval) {
        const startedAt = this._parseDate(interval.startedAt);
        const finishedAt = this._parseDate(interval.finishedAt);

        if (!startedAt || !finishedAt) {
            interval.error = locales.taskIntervalsModal.invalidDateMessage;

            return;
        }

        if (finishedAt <= startedAt) {
            interval.error = locales.taskIntervalsModal.invalidRangeMessage;

            return;
        }

        interval.error = undefined;
    }

    _validateAll() {
        let hasError = false;

        for (const interval of this.intervals) {
            this._validateInterval(interval);

            if (interval.error) {
                hasError = true;
            }
        }

        return !hasError;
    }

    _getUpdatedIntervals() {
        return this.intervals.map((interval) => ({
            startedAt: this._parseDate(interval.startedAt),
            finishedAt: this._parseDate(interval.finishedAt),
        }));
    }

    onSaveClick() {
        if (!this._validateAll()) {
            this.redraw();

            return;
        }

        if (!confirm(languageModel.t(locales.taskIntervalsModal.saveConfirm))) {
            return;
        }

        const updatedIntervals = this._getUpdatedIntervals();

        updatedIntervals.sort((left, right) => {
            const leftTime = left.startedAt ? left.startedAt.getTime() : 0;
            const rightTime = right.startedAt ? right.startedAt.getTime() : 0;

            return leftTime - rightTime;
        });

        const newIntervals = updatedIntervals.map((interval) => new TaskIntervalModel(interval));
        const totalMilliseconds = newIntervals.reduce((result, interval) => result + interval.durationInMilliseconds, 0);
        const durationInSeconds = Math.round(totalMilliseconds / 1000);

        this.task._finishedIntervals = newIntervals;
        this.task._durationInSeconds = durationInSeconds;
        this.task._startedAt = this.task._startedAt;

        trackerPageModel.tasks = [...trackerPageModel.tasks];
        trackerPageModel.updateTotalTime();
        trackerPageModel.updateTimeOfFirstTouchToday();
        trackerPageModel.saveToLocalStorage();

        modalWindowModel.closeModal();
    }

    onCancelClick() {
        if (!confirm(languageModel.t(locales.taskIntervalsModal.cancelConfirm))) {
            return;
        }

        modalWindowModel.closeModal();
    }

    _renderIntervals() {
        if (!this.intervals.length) {
            return t`
                <p class="task-intervals-modal__empty">${languageModel.t(locales.taskIntervalsModal.emptyState)}</p>
            `;
        }

        return this.intervals.map((interval, index) => {
            const error = interval.error ? t`<p class="task-intervals-modal__error">${languageModel.t(interval.error)}</p>` : '';

            return t`
                <section class="task-intervals-modal__interval" aria-labelledby="${interval.id}-label">
                    <h2 id="${interval.id}-label">${languageModel.t(locales.taskIntervalsModal.intervalTitle)} #${index + 1}</h2>
                    <div class="task-intervals-modal__fields">
                        <label class="task-intervals-modal__field">
                            <span>${languageModel.t(locales.taskIntervalsModal.startLabel)}</span>
                            <input
                                type="datetime-local"
                                step="1"
                                value="${interval.startedAt}"
                                onchange="${(event) => this.onIntervalChange(interval.id, 'startedAt', event.target.value)}"
                            />
                        </label>
                        <label class="task-intervals-modal__field">
                            <span>${languageModel.t(locales.taskIntervalsModal.endLabel)}</span>
                            <input
                                type="datetime-local"
                                step="1"
                                value="${interval.finishedAt}"
                                onchange="${(event) => this.onIntervalChange(interval.id, 'finishedAt', event.target.value)}"
                            />
                        </label>
                    </div>
                    ${error}
                </section>
            `;
        });
    }

    toHtml() {
        return t`
            <dialog class="task-intervals-modal" open aria-labelledby="${this.dialogTitleId}">
                <form class="task-intervals-modal__form" id="${this.formId}" method="dialog" novalidate>
                    <header class="task-intervals-modal__header">
                        <h1 id="${this.dialogTitleId}">${languageModel.t(locales.taskIntervalsModal.title)}</h1>
                        <p class="task-intervals-modal__task">
                            ${languageModel.t(locales.taskIntervalsModal.taskLabel)}
                            <span>${this.task.title}</span>
                        </p>
                        <p class="task-intervals-modal__subtitle">${languageModel.t(locales.taskIntervalsModal.subtitle)}</p>
                    </header>
                    <div class="task-intervals-modal__content">
                        ${this._renderIntervals()}
                    </div>
                    <footer class="task-intervals-modal__actions">
                        <button type="button" class="task-intervals-modal__button task-intervals-modal__button--secondary" onclick="${() => this.onCancelClick()}">
                            ${languageModel.t(locales.taskIntervalsModal.cancelButton)}
                        </button>
                        <button type="button" class="task-intervals-modal__button task-intervals-modal__button--primary" onclick="${() => this.onSaveClick()}">
                            ${languageModel.t(locales.taskIntervalsModal.saveButton)}
                        </button>
                    </footer>
                </form>
            </dialog>
        `;
    }
}

modalWindowModel.registerModal('TaskIntervalsModalWindowComponent', TaskIntervalsModalWindowComponent);
