class TabButtonComponent extends Component {
    /**
     * @param {object} params
     * @param {string} params.content
     * @param {string} params.isActive
     * @param {() => void} params.onClick
     */
    constructor({ content, isActive, onClick }) {
        super();

        this.content = content;
        this.isActive = isActive;
        this.onClick = onClick;
    }

    toHtml() {
        return t`
            <div
                class="tab-panel-component__button ${this.isActive ? 'tab-panel-component__button-active' : ''}"
                onclick="${() => this.isActive ? undefined : this.onClick()}"
            >
                ${this.content}
            <div>
        `;
    }
}

class TabPanelComponent extends Component {
    /**
     * @param {object} params
     * @param {{ key: string; content: any }[]} params.tabs
     * @param {string} params.activeTabKey
     * @param {(string) => void} params.onSelect
     */
    constructor({ tabs, activeTabKey, onSelect }) {
        super();

        this.tabs = tabs;
        this.activeTabKey = activeTabKey;
        this.onSelect = onSelect;
    }

    toHtml() {
        const tabComponents = this.tabs.map((tab) => new TabButtonComponent({
            content: tab.content,
            isActive: tab.key === this.activeTabKey,
            onClick: () => this.onSelect(tab.key),
        }));

        return t`
            <div class="tab-panel-component">
                ${tabComponents}
            <div>
        `;
    }
}
