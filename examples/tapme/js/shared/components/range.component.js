class RangeComponent extends Component {
    /**
     * @param {number} min
     * @param {number} max
     * @param {number} minValue
     * @param {number} maxValue
     * @param {number} [timeout]
     * @param {(params: { min: number; max: number }) => void} onChange
     */
    constructor({ min, max, minValue, maxValue, timeout, onChange }) {
        super();

        this.min = min;
        this.max = max;

        this.minValue = minValue;
        this.maxValue = maxValue;

        this.minId = getId();
        this.maxId = getId();

        this.onChange = onChange;

        this.hasTimeout = false;
        this.timeout = timeout;
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

    onMove() {
        if (this.hasTimeout || !this.timeout) {
            return;
        }

        this.hasTimeout = true;

        setTimeout(() => {
            this.hasTimeout = false;

            this.callOnChange();
        }, this.timeout);
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
                        value="${this.minValue}" 
                        class="range-component__slider"
                        oninput="${() => this.onMove()}"
                        onchange="${() => this.onMinChange()}"
                    >
                    <input
                        id="${this.maxId}"
                        type="range"
                        min="${this.min}"
                        max="${this.max}" 
                        value="${this.maxValue}" 
                        class="range-component__slider" 
                        oninput="${() => this.onMove()}"
                        onchange="${() => this.onMaxChange()}"
                    >
                </div>
            </div>
        `;
    }
}
