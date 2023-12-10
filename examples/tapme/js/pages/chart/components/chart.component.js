function hexToRgb(hex) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
}

/**
 * @param {any} value
 * @return {string}
 */
function getTooltip(value) {
    const { tags, seconds } = value;

    const tagComponents = tags.map((tag) => `
        <div class="tooltip-tag" style="background-color: ${trackerPageModel.getTagColor(tag)}">${tag}</div>
    `).join('');

    return `
        <div class="chart-js-custom-tooltip">
            <div class="tooltip-line">
                ${value.date.toLocaleDateString()} 
                (${value.date.toLocaleString(window.navigator.language, { weekday: 'short' })})
            </div>
            <div class="tooltip-line">${timeFormatService.durationFormatted(seconds)}</div>
            <div class="tooltip-line">${tagComponents}</div>
        </div>
    `;
}

class ChartComponent extends Component {
    constructor() {
        super();

        this.canvasId = getId();
        this.chart = undefined;

        this.subscribe(chartModel.chartData).onChange(() => this.updateChart());
    }

    onDestroy() {
        if (!this.chart) {
            return;
        }

        this.chart.destroy();
    }

    async updateChart() {
        if (!this.chart) {
            return;
        }

        const { labels, datasets } = await this.getChartData();

        this.chart.data.labels = labels;
        this.chart.data.datasets = datasets;

        this.chart.update();
    }

    /**
     * @return {Promise<{ datasets: Object[], labels: string[]; ctx: object }>}
     */
    async getChartData() {
        const ctx = document.getElementById(this.canvasId).getContext('2d');

        const labels = ChartDatasetsPreparerService.getLabels(chartModel.chartData.days);

        const datasets = await ChartDatasetsPreparerService.getDatasets({
            days: chartModel.chartData.days,
            activeTags: chartModel.chartData.activeTags,
            ctx,
        });

        return { labels, datasets, ctx };
    }

    async onRender() {
        if (this.chart) {
            await this.updateChart();

            return;
        }

        const { labels, datasets, ctx } = await this.getChartData();

        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets,
            },
            options: {
                animations: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                    colors: {
                        enabled: false
                    },
                    title: {
                        display: true,
                    },
                    tooltip: {
                        enabled: false,
                        position: 'nearest',
                        external: function (context) {
                            // Tooltip Element
                            let tooltipEl = document.getElementById('chartjs-tooltip');

                            // Create element on first render
                            if (!tooltipEl) {
                                tooltipEl = document.createElement('div');
                                tooltipEl.id = 'chartjs-tooltip';
                                tooltipEl.innerHTML = '<table></table>';
                                document.body.appendChild(tooltipEl);
                            }

                            // Hide if no tooltip
                            const tooltipModel = context.tooltip;
                            if (tooltipModel.opacity === 0) {
                                tooltipEl.style.opacity = 0;
                                return;
                            }

                            // Set Text
                            if (tooltipModel.body) {
                                const value = context.tooltip.dataPoints[0].raw;

                                const tableRoot = tooltipEl.querySelector('table');
                                tableRoot.innerHTML = getTooltip(value);
                            }

                            const position = context.chart.canvas.getBoundingClientRect();
                            const bodyFont = Chart.helpers.toFont(tooltipModel.options.bodyFont);

                            // Display, position, and set styles for font
                            tooltipEl.style.opacity = 1;
                            tooltipEl.style.position = 'absolute';
                            tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                            tooltipEl.style.font = bodyFont.string;
                            tooltipEl.style.padding = tooltipModel.padding + 'px ' + tooltipModel.padding + 'px';
                            tooltipEl.style.pointerEvents = 'none';

                            let leftPosition = position.left + window.pageXOffset + tooltipModel.caretX;

                            leftPosition = leftPosition > (window.innerWidth / 2)
                                ? leftPosition - tooltipEl.offsetWidth - 20
                                : leftPosition + 20;

                            tooltipEl.style.left = leftPosition + 'px';
                        },
                    },
                },
                responsive: true,
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true,
                    },
                },
                barPercentage: 1,
                categoryPercentage: 0.98,
            },
        });
    }

    toHtml() {
        setTimeout(() => this.onRender(), 0);

        return t`
            <div>
                <canvas id="${this.canvasId}"></canvas>
            </div>
        `;
    }
}
