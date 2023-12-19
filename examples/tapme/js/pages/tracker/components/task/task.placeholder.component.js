class TaskPlaceholderComponent extends Component {
    constructor() {
        super();

        this.dots = this.createRedrawable('', 'dots');
        this.timer = setInterval(() => this.tick(), 500);
    }

    onDestroy() {
        clearInterval(this.timer);
    }

    tick() {
        if (this.dots.length < 3) {
            this.dots += '.';
        } else {
            this.dots = '';
        }
    }

    toHtml() {
        return t`
            <div class="task-placeholder">
                <span>
                    Add something${this.dots}
                </span>
            </div>
        `;
    }
}
