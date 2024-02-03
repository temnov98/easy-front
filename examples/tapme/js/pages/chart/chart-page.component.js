class ChartPageComponent extends AutoSubscribeComponent {
    getLinesComponents() {
        return [
            new ChartDayLinesButtonsPanelComponent({ onChangeView: () => chartModel.setChartMode(ChartMode.Bars) }),
            ChartDayLinesComponent,
        ];
    }

    getBarComponents() {
        return [
            new ChartButtonsPanelComponent({ onChangeView: () => chartModel.setChartMode(ChartMode.Lines) }),
            ChartTagsPanelComponent,
            ChartComponent,
            ChartRangeComponent,
        ];
    }

    toHtml() {
        const components = chartModel.chartMode === ChartMode.Lines
            ? this.getLinesComponents()
            : this.getBarComponents();

        return t`
            <div class="chart-page-component">
                ${components}
            </div>
        `;
    }
}
