class ChartIntervalOptionComponent extends Component {
    constructor(interval) {
        super();

        const titleMapping = {
            [ChartLastInterval.All]: locales.chart.chartInterval.all,
            [ChartLastInterval.Today]: locales.chart.chartInterval.today,
            [ChartLastInterval.ThisWeek]: locales.chart.chartInterval.thisWeek,
            [ChartLastInterval.ThisMonth]: locales.chart.chartInterval.thisMonth,
            [ChartLastInterval.ThisYear]: locales.chart.chartInterval.thisYear,
            [ChartLastInterval.Last7Days]: locales.chart.chartInterval.last7Days,
            [ChartLastInterval.Last14Days]: locales.chart.chartInterval.last14Days,
            [ChartLastInterval.Last30Days]: locales.chart.chartInterval.last30Days,
            [ChartLastInterval.Last90Days]: locales.chart.chartInterval.last90Days,
            [ChartLastInterval.Last180Days]: locales.chart.chartInterval.last180Days,
            [ChartLastInterval.Last365Days]: locales.chart.chartInterval.last365Days,
        };

        this.title = languageModel.t(titleMapping[interval]);
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

class ChartDayLinesButtonsPanelComponent extends Component {
    constructor({ onChangeView }) {
        super();

        this.onChangeView = onChangeView;

        this.subscribe(languageModel.language).redrawOnChange();
    }

    toHtml() {
        return t`
            <div class="chart__buttons-panel__container">
                <button
                    onclick="${() => chartModel.selectFiles()}"
                >
                    ${languageModel.t(locales.chart.selectFilesButtonTitle)}
                </button>

                <button
                    onclick="${() => chartModel.clearChart()}"
                >
                    ${languageModel.t(locales.chart.clearButtonTitle)}
                </button>

                <button
                    onclick="${() => this.onChangeView()}"
                >
                    ${languageModel.t(locales.chart.changeViewButtonTitle)}
                </button>
            </div>
        `;
    }
}

class ChartButtonsPanelComponent extends Component {
    constructor({ onChangeView }) {
        super();

        this.onChangeView = onChangeView;

        this.selectId = getId();
        this.checkboxId = getId();

        this.subscribe(languageModel.language).redrawOnChange();
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
                    ${languageModel.t(locales.chart.selectFilesButtonTitle)}
                </button>

                <button
                    onclick="${() => chartModel.clearChart()}"
                >
                    ${languageModel.t(locales.chart.clearButtonTitle)}
                </button>

                <button
                    onclick="${() => this.onChangeView()}"
                >
                    ${languageModel.t(locales.chart.changeViewButtonTitle)}
                </button>

                <div class="chart__buttons-panel__show-empty-days">
                    <input
                        id="${this.checkboxId}"
                        type="checkbox"
                        ${chartModel.showEmptyDays ? 'checked' : ''}
                        onchange="${(event) => chartModel.setShowEmptyDays(event.target.checked)}"
                    />
                    <label for="${this.checkboxId}">
                        ${languageModel.t(locales.chart.showEmptyDaysCheckboxTitle)}
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
