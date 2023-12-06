class EasyFrontDebugComponent extends AutoSubscribeComponent {
    constructor() {
        super();

        this.timer = setInterval(() => this.redraw(), 1000);
    }

    onDestroy() {
        clearInterval(this.timer);
    }

    toHtml() {
        return t`
            <div class="none">
                <div class="debug-components-count">
                    Components count: ${_idToComponentMapping.size}
                </div>
                <div class="debug-handlers-count">
                    Handlers count: ${_globalFunctions.size}
                </div>
                 <div class="debug-warnings-count">
                    Warnings count: ${_logger.warningsCount}
                </div>
                <div class="debug-errors-count">
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
