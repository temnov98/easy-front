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
    }

    get currentSwitcherClass() {
        return this.active ? 'switcher-circle-active switcher-circle' : 'switcher-circle-inactive switcher-circle';
    }

    toggle() {
        this.active = !this.active;
    }

    onClick() {
        this.params?.onClick();

        this.toggle();
        this.switherClass.className = this.currentSwitcherClass;
    }

    toHtml() {
        return t`
            <div class="switcher-container" onmousedown="${() => this.onClick()}">
                <div class="${this.switherClass}"></div>
            </div>
        `;
    }
}
