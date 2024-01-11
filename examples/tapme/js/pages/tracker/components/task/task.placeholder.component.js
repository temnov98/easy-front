class TaskPlaceholderComponent extends Component {
    constructor() {
        super();

        this.dots = this.createRedrawable('', 'dots');
        this.timer = setInterval(() => this.tick(), 500);

        this.subscribe(languageModel.language).redrawOnChange();
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
        const title = languageModel.t(locales.addSomethingTitle);

        return t`
            <div class="task-placeholder">
                <span>
                    ${title}${this.dots}
                </span>
            </div>
        `;
    }
}
