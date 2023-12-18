class SwitcherComponent extends Component {
    /**
     * @param {Object} [params]
     * @param {() => void} [params.onClick]
     * @param {boolean} [params.defaultState]
     * @param {Component} [params.content]
     */
    constructor(params) {
        super();

        this.params = params;

        this.active = this.params?.defaultState ?? false;
        this.switherClass = new CssClass(this.currentSwitcherClass);
        this.switherContainerClass = new CssClass(this.currentSwitcherContainerClass);
        this.content = params.content;
    }

    get currentSwitcherClass() {
        return this.active ? 'switcher-component__circle-active' : 'switcher-component__circle-inactive';
    }

    get currentSwitcherContainerClass() {
        return this.active ? 'switcher-component__container-active' : 'switcher-component__container-inactive';
    }

    toggle() {
        this.active = !this.active;
    }

    onClick() {
        this.toggle();

        this.switherClass.className = this.currentSwitcherClass;
        this.switherContainerClass.className = this.currentSwitcherContainerClass;

        this.params?.onClick();
    }

    toHtml() {
        return t`
            <div class="${this.switherContainerClass}" onmousedown="${() => this.onClick()}">
                <div class="${this.switherClass}">
                    ${this.content ?? ''}
                </div>
            </div>
        `;
    }
}
