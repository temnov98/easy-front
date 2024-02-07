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
                    <svg class="debug-component__image-active" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M22 7.81V12.5H17.92C17.8 12.49 17.54 12.34 17.48 12.23L16.44 10.26C16.03 9.48 15.32 9.04 14.56 9.08C13.8 9.12 13.15 9.63 12.82 10.46L11.44 13.92L11.24 13.4C10.75 12.13 9.35 11.17 7.97 11.17L2 11.2V7.81C2 4.17 4.17 2 7.81 2H16.19C19.83 2 22 4.17 22 7.81Z"></path> <path d="M22 16.1887V13.9987H17.92C17.25 13.9987 16.46 13.5187 16.15 12.9287L15.11 10.9587C14.83 10.4287 14.43 10.4587 14.21 11.0087L11.91 16.8187C11.66 17.4687 11.24 17.4687 10.98 16.8187L9.84 13.9387C9.57 13.2387 8.73 12.6687 7.98 12.6687L2 12.6987V16.1887C2 19.7687 4.1 21.9287 7.63 21.9887C7.74 21.9987 7.86 21.9987 7.97 21.9987H15.97C16.12 21.9987 16.27 21.9987 16.41 21.9887C19.92 21.9087 22 19.7587 22 16.1887Z"></path> <path d="M2.0007 12.6992V16.0092C1.9807 15.6892 1.9707 15.3492 1.9707 14.9992V12.6992H2.0007Z"></path> </g></svg>
                </div>
            `;
        }
    }
}
