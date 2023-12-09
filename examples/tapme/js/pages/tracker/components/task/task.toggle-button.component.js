class TaskToggleButtonComponent extends AutoSubscribeComponent {
    /**
     * @param {TaskModel} task
     */
    constructor(task) {
        super();

        this.task = task;
    }

    toHtml() {
        const component = trackerPageModel.theme === 'dark'
            ? new TaskToggleButtonDarkComponent(this.task)
            : new TaskToggleButtonLightComponent(this.task);

        return t`
            <div>
                ${component}
            </div>
        `;
    }
}

class TaskToggleButtonLightComponent extends AutoSubscribeComponent {
    /**
     * @param {TaskModel} task
     */
    constructor(task) {
        super();

        this.task = task;
    }

    toHtml() {
        const buttonCssClass = this.task._startedAt ? 'base-button red-button' : 'base-button green-button';

        return t`
            <button
                class="${buttonCssClass}"
                onmousedown="${() => trackerPageModel.toggle(this.task)}">
                ${new Timer(this.task)}
            </button>
        `;
    }
}

class TaskToggleButtonDarkComponent extends Component {
    /**
     * @param {TaskModel} task
     */
    constructor(task) {
        super();

        this.task = task;
    }

    toHtml() {
        return t`
            <div class="toggle-button__container">
                ${new Timer(this.task)}
                <label class="toggle-button">
                ${new ToggleInput(this.task)}
                <span></span>
                <span></span>
                </label>
            </div>
        `;
    }
}

class ToggleInput extends AutoSubscribeComponent {

    /**
     * @param {TaskModel} task
     */
    constructor(task) {
        super();

        this.task = task;
    }

    toHtml() {
        const isChecked = this.task._startedAt;

        return t`
            <input
                type="checkbox"  
                onchange="${() => trackerPageModel.toggle(this.task)}"
                ${isChecked && 'checked'}
                >
        `;
    }
}

class Timer extends Component {
    /*
     * @param {TaskModel} task
     */
    constructor(task) {
        super();

        this.task = task;
        this.timer = undefined;

        if (this.task.isActive) {
            this.startRedrawing();
        }

        this.subscribe(this.task._startedAt).onChange(() => this.onChange());
    }

    onDestroy() {
        if (this.timer) {
            this.stopRedrawing();
        }
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
            trackerPageModel.updateTotalTime();

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
        return t`
            <div>
                ${this.task.durationFormatted}
            </div>
        `
    }
}
