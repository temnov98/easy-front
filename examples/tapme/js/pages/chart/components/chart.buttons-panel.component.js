class ChartIntervalOptionComponent extends Component {
    constructor(interval) {
        super();

        const titleMapping = {
            [ChartLastInterval.All]: 'All',
            [ChartLastInterval.Today]: 'Today',
            [ChartLastInterval.ThisWeek]: 'This week',
            [ChartLastInterval.ThisMonth]: 'This month',
            [ChartLastInterval.Last7Days]: 'Last 7 days',
            [ChartLastInterval.Last14Days]: 'Last 14 days',
            [ChartLastInterval.Last30Days]: 'Last 30 days',
        };

        this.title = titleMapping[interval];
        this.value = interval;
    }

    toHtml() {
        return t`
            <option value="${this.value}">
                ${this.title}
            </option>
        `
    }
}

class ChartButtonsPanelComponent extends Component {
    constructor() {
        super();

        this.selectId = getId();
        this.checkboxId = getId();
    }

    get selectElement() {
        return document.getElementById(this.selectId);
    }

    onSelectInterval() {
        chartModel.setPreDefinedInterval(this.selectElement.value);
    }

    toHtml() {
        const availableIntervals = Object.values(ChartLastInterval);

        const options = availableIntervals.map((interval) => new ChartIntervalOptionComponent(interval));

        return t`
            <div class="chart__buttons-panel__container">
                <button
                    onclick="${() => chartModel.selectFiles()}"
                >
                    Select files
                </button>

                <button
                    onclick="${() => chartModel.clearChart()}"
                >
                    Clear
                </button>

                <div class="chart__buttons-panel__show-empty-days">
                    <input
                        id="${this.checkboxId}"
                        type="checkbox"
                        ${chartModel.showEmptyDays ? 'checked' : ''}
                        onchange="${(event) => chartModel.setShowEmptyDays(event.target.checked)}"
                    />
                    <label for="${this.checkboxId}">
                        Show empty days
                    </label>
                </div>
                

                <select
                    id="${this.selectId}"
                    onchange="${() => this.onSelectInterval()}"
                >
                    ${options}
                </select>
            </div>
        `;
    }
}
