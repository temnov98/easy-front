class DebugInnerComponent extends AutoSubscribeComponent {
    constructor() {
        super();

        this.timer = setInterval(() => this.redraw(), 1000);
    }

    onDestroy() {
        clearInterval(this.timer);
    }

    toHtml() {
        return t`
            <div>
                <div class="debug-component__components-count">
                    Components count: ${_idToComponentMapping.size}
                </div>
                <div class="debug-component__handlers-count">
                    Handlers count: ${_globalFunctions.size}
                </div>
                 <div class="debug-component__warnings-count">
                    Warnings count: ${_logger.warningsCount}
                </div>
                <div class="debug-component__errors-count">
                    Errors count: ${_logger.errorsCount}
                </div>
            </div>
        `;
    }
}

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
            const panelClass = this.initial ? 'debug-component__panel-initial' : 'debug-component__panel';

            return t`
                <div 
                    class="${panelClass}" 
                    onclick="${() => this.onClick()}"
                    onmouseleave="${() => this.onLeave()}"
                >
                    ${DebugInnerComponent}
                </div>
            `;
        } else {
            return t`
                <div class="debug-component__icon" onclick="${() => this.onClick()}">
                    <img class="debug-component__image-active" src="images/debug.svg" alt="Debug info">
                </div>
            `;
        }
    }
}
