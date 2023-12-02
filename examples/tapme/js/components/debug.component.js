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
