class ChartTagComponent extends Component {
    /**
     * @param {string} tag
     * @param {boolean} isActive
     * @param {(checked: boolean) => void} onClick
     */
    constructor({ tag, isActive, onClick }) {
        super();

        this.tag = tag;
        this.isActive = isActive;
        this.onClick = onClick;
    }

    toHtml() {
        return t`
            <div class="chart-tags-panel__tag" style="--color: ${hexToRgb(trackerPageModel.getTagColor(this.tag))}">
                <input
                    id="chart-tags-panel--${this.tag}"
                    type="checkbox"
                    onchange="${(event) => this.onClick(event.target.checked)}"
                    ${this.isActive ? 'checked' : ''}
                />
                <label for="chart-tags-panel--${this.tag}">
                    ${this.tag.trim()}
                </label>
            </div>
        `;
    }
}
