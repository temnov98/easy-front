class DeleteButtonComponent extends Component {
    /**
     * @param {() => void} onDelete
     */
    constructor(onDelete) {
        super();
        this.onDelete = onDelete;

        this.activeted = false;
        this.cssClass = new CssClass(this.cssClassNames);
    }

    get cssClassNames() {
        const base = 'icon-button icon-button--red icon-button--trash-bin';

        return this.activeted ? `${base} icon-button--trash-bin--open` : base;
    }

    onClick() {
        if (this.activeted) {
            this.onDelete();
        } else {
            this.activeted = true;
            this.cssClass.className = this.cssClassNames;
        }
    }

    onMouseLeave() {
        this.activeted = false;
        this.cssClass.className = this.cssClassNames;
    }

    toHtml() {
        return t`
            <button
                class="${this.cssClass}"
                onmouseleave="${() => this.onMouseLeave()}"
                onclick="${() => this.onClick()}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M2 6V8H22V6H17V2H7V6H2ZM9 4V6H15V4H9Z" />
                    <path d="M18 8H20V20C20 20.6667 19.6 22 18 22H6C4.4 22 4 20.6667 4 20V8H6V20H18V8Z" />
                </svg>
            </button>
        `;
    }
}
