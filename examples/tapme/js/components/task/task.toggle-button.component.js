class TaskToggleButtonComponent extends Component {
    /**
     * @param {TaskModel} task
     */
    constructor(task) {
        super();

        this.task = task;

        this._subscriber = new Subscriber(this.redraw.bind(this));

        pageModel.theme.connect(this._subscriber);
    }

    toHtml() {
        return pageModel.theme.value === 'dark'
            ? t`${new TaskToggleButtonDarkComponent(this.task)}`
            : t`${new TaskToggleButtonLightComponent(this.task)}`;
    }
}

class TaskToggleButtonLightComponent extends Component {
    /**
     * @param {TaskModel} task
     */
    constructor(task) {
        super();

        this.task = task;

        this._subscriber = new Subscriber(this.redraw.bind(this));

        this.task.connect(this._subscriber);
    }

    onDestroy() {
        this.task.disconnect(this._subscriber);
        super.onDestroy();
    }

    toHtml() {
        const buttonClass = this.task.isActive ? 'base-button red-button' : 'base-button green-button';

        return t`
            <button
                class="${buttonClass}"
                onmousedown="${() => pageModel.toggle(this.task)}">
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

class ToggleInput extends Component {

    /**
     * @param {TaskModel} task
     */
    constructor(task) {
        super();

        this.task = task;
        this.isChecked = this.task.isActive;

        this._subscriber = new Subscriber(() => this.onChange());
        this.task.connect(this._subscriber);
    }

    onChange() {
        this.isChecked = this.task.isActive;
        this.redraw(true);
    }

    onDestroy() {
        this.task.disconnect(this._subscriber);
        super.onDestroy();
    }

    toHtml() {
        return t`
            <input
                id="${this._id}"
                type="checkbox"  
                onchange="${() => pageModel.toggle(this.task)}"
                ${this.isChecked && 'checked'}
              >
        `;
    }

    _toHtml() {
        return t`
            ${this.toHtml()}
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
            pageModel.updateTotalTime();

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
            ${this.task.durationFormatted}
        `
    }
}