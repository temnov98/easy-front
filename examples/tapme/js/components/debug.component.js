class EasyFrontDebugComponent extends AutoSubscribeComponent {
    /**
     * @param {Object} [params]
     * @param {string} [params.mainClass]
     * @param {string} [params.componentsCountClass]
     * @param {string} [params.handlersCountClass]
     * @param {string} [params.errorsCountClass]
     * @param {number} [params.updateInterval]
     */
    constructor(params) {
        super();

        this.params = params;

        this.timer = setInterval(() => this.redraw(), this.params?.updateInterval ?? 1000);
    }

    onDestroy() {
        clearInterval(this.timer);
    }

    onChangeTheme(e) {
        localStorageService.setItem('theme', e.target.id);
        pageModel.theme = e.target.id;
        e.stopPropagation();
    }

    toHtml() {
        const {
            mainClass = '',
            componentsCountClass = '',
            handlersCountClass = '',
            errorsCountClass = '',
        } = this.params ?? {};

        const main = mainClass ? `class="${mainClass}"` : `style="${[
            'position: fixed;',
            'left: 10px;',
            'top: 10px;',
            'font-size: 20px;',
            'background-color: rgba(188, 188, 188, 0.45);',
            'padding: 10px;',
        ].join(';')}"`;

        const componentsCount = componentsCountClass ? `class="${componentsCountClass}"` : `style="${[
            'color: #183ce5;',
        ].join(';')}"`;

        const handlersCount = handlersCountClass ? `class="${handlersCountClass}"` : `style="${[
            'color: #3a6d15;',
        ].join(';')}"`;

        const errorsCount = errorsCountClass ? `class="${errorsCountClass}"` : `style="${[
            'color: red;',
        ].join(';')}"`;

        return t`
            <div ${main}>
                <div ${componentsCount}>
                    Components count: ${_idToComponentMapping.size}
                </div>
                <div ${handlersCount}>
                    Handlers count: ${_globalFunctions.size}
                </div>
                <div ${errorsCount}>
                    Errors count: ${_logger.errorsCount}
                </div>
                <fieldset>
                    <legend>Theme:</legend>
                    <label for="light">Light</label>
                    <input ${pageModel.theme === 'light' && 'checked'} onclick="${(e) => this.onChangeTheme(e)}" type="radio" id="light" name="light">
                    <label for="dark">Dark</label>
                    <input ${pageModel.theme === 'dark' && 'checked'} onclick="${(e) => this.onChangeTheme(e)}" type="radio" id="dark" name="dark">
                </fieldset>
            </div>
        `;
    }
}
