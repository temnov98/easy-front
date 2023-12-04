class SwitcherComponent extends Component {
    /**
     * @param {Object} [params]
     * @param {() => void} [params.onClick]
     * @param {boolean} [params.defaultState]
     */
    constructor(params) {
        super();

        this.params = params;

        this.active = this.params?.defaultState ?? false;
        this.switherClass = new CssClass(this.currentSwitcherClass);
        this.switherContainerClass = new CssClass(this.currentSwitcherContainerClass);
    }

    get currentSwitcherClass() {
        return this.active ? 'switcher-circle-active switcher-circle' : 'switcher-circle-inactive switcher-circle';
    }

    get currentSwitcherContainerClass() {
        return this.active ? 'switcher-container-active' : 'switcher-container-inactive';
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
                <div class="${this.switherClass}"></div>
            </div>
        `;
    }
}
