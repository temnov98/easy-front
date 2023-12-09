class TabButtonComponent extends Component {
    /**
     * @param {object} params
     * @param {string} params.title
     * @param {string} params.isActive
     * @param {() => void} params.onClick
     */
    constructor({ title, isActive, onClick }) {
        super();

        this.title = title;
        this.isActive = isActive;
        this.onClick = onClick;
    }

    toHtml() {
        return t`
            <div
                class="tab-button ${this.isActive ? 'tab-button-active' : ''}"
                onclick="${() => this.isActive ? undefined : this.onClick()}"
            >
                ${this.title}
            <div>
        `;
    }
}

class TabPanelComponent extends Component {
    /**
     * @param {object} params
     * @param {string[]} params.tabs
     * @param {string} params.activeTab
     * @param {(string) => void} params.onSelect
     */
    constructor({ tabs, activeTab, onSelect }) {
        super();

        this.tabs = tabs;
        this.activeTab = activeTab;
        this.onSelect = onSelect;
    }

    toHtml() {
        const tabComponents = this.tabs.map((title) => new TabButtonComponent({
            title,
            isActive: title === this.activeTab,
            onClick: () => this.onSelect(title),
        }));

        return t`
            <div class="tab-panel">
                ${tabComponents}
            <div>
        `;
    }
}
