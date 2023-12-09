class RangeComponent extends Component {
    /**
     * @param {number} min
     * @param {number} max
     * @param {(params: { min: number; max: number }) => void} onChange
     */
    constructor({ min, max, onChange }) {
        super();

        this.min = min;
        this.max = max;

        this.minId = getId();
        this.maxId = getId();

        this.onChange = onChange;
    }

    get minElement() {
        return document.getElementById(this.minId);
    }

    get maxElement() {
        return document.getElementById(this.maxId);
    }

    callOnChange() {
        this.onChange({
            min: +this.minElement.value,
            max: +this.maxElement.value,
        });
    }

    onMaxChange() {
        this.maxElement.value = Math.max(this.minElement.value, this.maxElement.value);

        this.callOnChange();
    }

    onMinChange() {
        this.minElement.value = Math.min(this.minElement.value, this.maxElement.value);

        this.callOnChange();
    }

    toHtml() {
        return t`
            <div>
                <div class="range-component">
                    <input
                        id="${this.minId}"
                        type="range"
                        min="${this.min}"
                        max="${this.max}" 
                        value="${this.min}" 
                        class="range-component__slider"
                        onchange="${() => this.onMinChange()}"
                        title="${this.min}"
                    >
                    <input
                        id="${this.maxId}"
                        type="range"
                        min="${this.min}"
                        max="${this.max}" 
                        value="${this.max}" 
                        class="range-component__slider" 
                        onchange="${() => this.onMaxChange()}"
                        title="${this.max}"
                    >
                </div>
            </div>
        `;
    }
}
