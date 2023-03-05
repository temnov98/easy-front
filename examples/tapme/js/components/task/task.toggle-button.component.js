class TaskToggleButtonComponent extends Component {
    /**
     * @param {TaskModel} task
     */
    constructor(task) {
        super();

        this.task = task;
        this.timer = undefined;

        if (this.task.isActive) {
            this.startRedrawing();
        }

        this._subscriber = new Subscriber(() => this.onChange());

        this.task.connect(this._subscriber);
    }

    onDestroy() {
        if (this.timer) {
            this.stopRedrawing();
        }

        this.task.disconnect(this._subscriber);
    }

    onChange() {
        this.redraw();

        if (this.task.isActive && !this.timer) {
            this.startRedrawing();
        } else if (!this.task.isActive && this.timer) {
            this.stopRedrawing();
        }
    }

    startRedrawing() {
        this.timer = setInterval(() => {
            const redrawResult = this.redraw();

            if (!redrawResult) {
                this.stopRedrawing();
            }
        }, 1000);
    }

    stopRedrawing() {
        clearInterval(this.timer);
        this.timer = undefined;
    }

    toHtml() {
        const buttonClass = this.task.isActive ? 'base-button red-button' : 'base-button green-button';

        return t`
            <div>
                <button
                    class="${buttonClass}"
                    onmousedown="${() => pageModel.toggle(this.task)}">
                    ${this.task.durationFormatted}
                </button>
            </div>
        `;
    }
}
