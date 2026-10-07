// TODO: Между `TrackerPipService` и `TrackerPageModel` есть циклическая зависимость.
//       Сейчас оно работает, но в будущем при изменении можно случайно сломать.
//       Нужно избавиться от циклической зависимости когда-нибудь потом.
class TrackerPipService {
    constructor() {
        this.lastTouchedStorageKey = 'time-tracker-local-storage-key:pip:last-touched-id';
        this.lastTouchedId = localStorage.getItem(this.lastTouchedStorageKey) || undefined;
        this.pipWindow = undefined;
        this.timer = undefined;
    }

    /**
     * @return {boolean}
     */
    get enabled() {
        return experimentalFeatureModel.isFeatureEnabled(ExperimentalFeature.PictureInPicture);
    }

    /**
     * @return {boolean}
     */
    get supported() {
        return window.isSecureContext && 'documentPictureInPicture' in window;
    }

    /**
     * @private
     * @return {TaskModel | undefined}
     */
    get _task() {
        return trackerPageModel.tasks.find((task) => task.id === this.lastTouchedId);
    }

    /**
     * @private
     * @param {TaskModel} task
     * @returns {void}
     */
    _touch(task) {
        this.lastTouchedId = task.id;
        localStorage.setItem(this.lastTouchedStorageKey, task.id);
        this._render();
    }

    /**
     * @returns {void}
     */
    onFeatureToggled() {
        if (!this.supported) {
            return;
        }

        if (this.enabled) {
            void this._open();
        } else {
            this._close();
        }
    }

    /**
     * @private
     * @param {TaskModel} task
     * @param {boolean} fromPip
     * @returns {void}
     */
    onTaskToggled({ task, fromPip }) {
        this._touch(task);

        if (this.enabled && !fromPip) {
            void this._open();
        }

        this._render();
    }

    /**
     * @return {Promise<void>}
     */
    async _open() {
        if (this.pipWindow?.closed) {
            this._close();
        }

        if (!this._task || !this.supported || this.pipWindow) {
            return;
        }

        try {
            const pipWindow = await window.documentPictureInPicture.requestWindow({
                width: 240,
                height: 62,
                disallowReturnToOpener: true,
                preferInitialWindowPlacement: true,
            });

            if (!this._task) {
                pipWindow.close();
                return;
            }

            this.pipWindow = pipWindow;
            pipWindow.document.title = '';
            const style = pipWindow.document.createElement('style');
            style.textContent = `
                * { box-sizing: border-box; }
                html, body { width: 100%; height: 100%; }
                body { margin: 0; font: 14px system-ui, sans-serif; background: #202b42; color: white; overflow: hidden; }
                .pip-row { height: 100%; display: flex; align-items: center; gap: 8px; padding: 4px 8px; }
                .pip-content { flex: 1; min-width: 0; text-align: center; }
                .pip-name { line-height: 16px; max-height: 32px; overflow: hidden; overflow-wrap: anywhere; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; font-weight: 600; }
                .pip-time { margin-top: 2px; line-height: 16px; font-variant-numeric: tabular-nums; opacity: .8; }
                .pip-button { flex: none; display: grid; place-items: center; width: 34px; height: 34px; padding: 0; border: 0; border-radius: 50%; color: white; cursor: pointer; }
                .pip-button.on { background: #bd7979; }
                .pip-button.on:hover { background: #ca8989; }
                .pip-button.off { background: #79a77c; }
                .pip-button.off:hover { background: #8bb78e; }
                .pip-button.on::before { content: ''; width: 11px; height: 11px; border-radius: 1px; background: currentColor; }
                .pip-button.off::before { content: ''; width: 0; height: 0; margin-left: 3px; border-top: 8px solid transparent; border-bottom: 8px solid transparent; border-left: 12px solid currentColor; }
            `;
            pipWindow.document.head.append(style);
            const row = pipWindow.document.createElement('div');
            row.className = 'pip-row';
            row.innerHTML = '<button class="pip-button" type="button"></button><div class="pip-content"><div class="pip-name"></div><div class="pip-time"></div></div>';
            pipWindow.document.body.append(row);
            row.querySelector('button').addEventListener('click', () => {
                if (this._task) {
                    trackerPageModel.toggle({ task: this._task, fromPip: true });
                }
            });

            pipWindow.addEventListener('pagehide', () => {
                if (this.pipWindow !== pipWindow) {
                    return;
                }

                this.pipWindow = undefined;
                clearInterval(this.timer);
                this.timer = undefined;
            });

            this.timer = setInterval(() => this._render(), 1000);
            this._render();
        } catch (error) {
            console.warn('Picture-in-Picture could not open:', error);
        }
    }

    /**
     * @returns {void}
     */
    onTaskTextChanged() {
        this._render();
    }

    /**
     * @private
     * @returns {void}
     */
    _render() {
        if (!this.pipWindow || this.pipWindow.closed) {
            return;
        }

        const task = this._task;
        if (!task) {
            this._close();
            return;
        }

        const doc = this.pipWindow.document;
        doc.querySelector('.pip-time').textContent = task.durationFormatted;
        const button = doc.querySelector('.pip-button');
        button.className = `pip-button ${task.isActive ? 'on' : 'off'}`;
        button.setAttribute('aria-label', task.isActive ? 'Stop timer' : 'Start timer');
        doc.querySelector('.pip-name').textContent = task.title.trim();
    }

    /**
     * @returns {void}
     */
    onTasksDeleted() {
        if (this._task) {
            return;
        }

        this.lastTouchedId = undefined;
        localStorage.removeItem(this.lastTouchedStorageKey);
        this._close();
    }

    /**
     * @private
     * @returns {void}
     */
    _close() {
        if (this.pipWindow && !this.pipWindow.closed) {
            this.pipWindow.close();
        }

        this.pipWindow = undefined;
        clearInterval(this.timer);
        this.timer = undefined;
    }
}

const trackerPipService = new TrackerPipService();
