class TaskPlaceholderComponent extends Component {
    constructor() {
        super();

        this.dotsCount = this.createRedrawable(0, 'dotsCount');
        this.timer = setInterval(() => this.tick(), 500);
    }

    onDestroy() {
        clearInterval(this.timer);
    }

    tick() {
        if (this.dotsCount < 3) {
            this.dotsCount++;
        } else {
            this.dotsCount = 0;
        }
    }

    get dots() {
        let result = '';

        for (let i = 0; i < this.dotsCount; i++) {
            result += '.';
        }

        return result;
    }

    toHtml() {
        return t`
            <div class="task-placeholder">
                Add something${this.dots}
            </div>
        `;
    }
}
