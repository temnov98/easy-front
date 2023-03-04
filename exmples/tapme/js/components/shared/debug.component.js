class DebugComponent extends Component {
    constructor() {
        super();

        this.expanded = this.createRedrawable(false, 'expanded');
        this.initial = this.createRedrawable(false, 'initial');
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
            const debugClasses = {
                mainClass: 'none',
                componentsCountClass: 'debug-components-count',
                handlersCountClass: 'debug-handlers-count',
                errorsCountClass: 'debug-errors-count',
            };

            const panelClass = this.initial ? 'debug-panel-initial' : 'debug-panel';

            return t`
                <div 
                    class="${panelClass}" 
                    onmousedown="${() => this.onClick()}"
                     onmouseleave="${() => this.onLeave()}"
                >
                    ${new EasyFrontDebugComponent(debugClasses)}
                </div>
            `;
        } else {
            return t`
                <div class="debug-icon" onmousedown="${() => this.onClick()}">
                    <img class="debug-image-active" src="images/debug.svg" alt="Image">
                </div>
            `;
        }
    }
}
