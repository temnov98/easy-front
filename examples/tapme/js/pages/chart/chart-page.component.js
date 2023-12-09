// TODO: это самый плохой код в моей жизни, но я хотел сделать быстро и чтобы работало. И я смог.
// TODO: refactor it

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
        <div class="tooltip-tag" style="background-color: ${tagToColor(tag)}">${tag}</div>
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

class ChartPageComponent extends Component {
    constructor() {
        super();

        this.canvasId = getId();

        this.subscribe(chartModel.days).redrawOnChange();
        this.subscribe(chartModel.activeTags).redrawOnChange();
    }

    async onRender() {
        const ctx = document.getElementById(this.canvasId).getContext('2d');

        const labels = ChartDatasetsPreparerService.getLabels(chartModel.days);

        const datasets = await ChartDatasetsPreparerService.getDatasets({
            days: chartModel.days,
            activeTags: chartModel.activeTags,
            ctx,
        });

        new Chart(ctx, {
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
                                tooltipEl.style.opacity = 0; // todo: set to 0
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

        const tagsComponents = chartModel.allTags.map((tag) => t`
            <div class="chart-tags-panel__tag" style="--color: ${hexToRgb(tagToColor(tag))}">
                <input
                    id="chart-tags-panel--${tag}"
                    type="checkbox"
                    onchange="${(event) => chartModel.toggleTag(tag, event.target.checked)}"
                    ${chartModel.activeTags.has(tag) ? 'checked' : ''}
                />
                <label for="chart-tags-panel--${tag}">${tag.trim()}</label>
            </div>
        `);

        return t`
            <div class="chart-page-component">
                <div>
                    <button onclick="${() => chartModel.selectFiles()}">Select files</button>
                    <button onclick="${() => chartModel.clearChart()}">Clear</button>
                </div>
                
                <div class="chart-tags-panel">
                    ${tagsComponents}
                </div>

                <canvas id="${this.canvasId}"></canvas>
            </div>
        `;
    }
}
