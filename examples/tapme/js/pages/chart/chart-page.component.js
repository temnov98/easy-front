class ChartPageComponent extends Component {
    toHtml() {
        return t`
            <div class="chart-page-component">
                ${ChartButtonsPanelComponent}
                ${ChartTagsPanelComponent}
                ${ChartComponent}
                ${ChartRangeComponent}
            </div>
        `;
    }
}
