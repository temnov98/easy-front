class DebugComponent extends Component {
    constructor() {
        super();

        this.expanded = this.createFullRedrawable(false, 'expanded');
        this.initial = this.createFullRedrawable(false, 'initial');
    }

    onClick() {
        this.expanded = !this.expanded;

        this.initial = this.expanded;
    }

    onLeave() {
        if (this.initial) {
            this.initial = false;
        }
    }

    toHtml() {
        if (this.expanded) {
            const panelClass = this.initial ? 'debug-panel-initial' : 'debug-panel';

            return t`
                <div 
                    class="${panelClass}" 
                    onclick="${() => this.onClick()}"
                    onmouseleave="${() => this.onLeave()}"
                >
                    ${EasyFrontDebugComponent}
                </div>
            `;
        } else {
            return t`
                <div class="debug-icon" onclick="${() => this.onClick()}">
                    <img class="debug-image-active" src="images/debug.svg" alt="Image">
                </div>
            `;
        }
    }
}
