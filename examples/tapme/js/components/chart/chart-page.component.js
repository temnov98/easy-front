// TODO: это самый плохой код в моей жизни, но я хотел сделать быстро и чтобы работало. И я смог.
// TODO: refactor it

/**
 * @param {any} value
 * @return {string}
 */
function getTooltip(value) {
    const { tags, seconds } = value;

    const tagComponents = tags.map((tag) => `
        <div class="tooltip-tag" style="background-color: ${getColor([tag])}">${tag}</div>
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

function generateRandomHexColor() {
    const getHex = () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0');

    return `#${getHex()}${getHex()}${getHex()}`;
}

class TaskData {
    constructor({ tags, seconds }) {
        this.tags = (tags ?? ['No tag']).sort();

        if (!this.tags.length) {
            this.tags.push('No tag');
        }

        this.seconds = seconds;
    }

    static fromRaw(raw) {
        return new TaskData({
            tags: raw.tags,
            seconds: raw.seconds,
        });
    }
}

class DayData {
    constructor({ date, tasks }) {
        this.date = date;
        this.tasks = tasks;
    }

    static fromRaw(raw) {
        return new DayData({
            date: new Date(raw.date),
            tasks: raw.tasks.map((task) => TaskData.fromRaw(task))
        });
    }
}

function realDataToDayData(date, data) {
    return new DayData({
        date,
        tasks: data.tasks.map((task) => new TaskData({
            tags: task.tags,
            seconds: task.duration,
        })),
    });
}

function realCsvDataToDayData(date, data) {
    const lines = data.split('\n').filter((line, index) => index !== 0 && !!line.length);

    const tasks = [];

    for (const line of lines) {
        const [title, seconds, formatted, tags] = line.split(';');

        tasks.push(new TaskData({
            tags: tags ? tags.split(',') : undefined,
            seconds: (+seconds) * 1000,
        }));
    }

    return new DayData({
        date,
        tasks,
    });
}

let testData = [];
let allTags = [];
let activeTags = new Set();

function refreshConstants() {
    testData.sort((left, right) => left.date.getTime() - right.date.getTime());
    allTags = [...new Set(testData.map((day) => day.tasks.map((task) => task.tags)).flat(2))];
    activeTags = new Set(allTags);
}

function saveToLocalStorage() {
    localStorage.setItem('__chart-test-data', JSON.stringify(testData));
}

function readFromLocalStorage() {
    const raw = JSON.parse(localStorage.getItem('__chart-test-data') ?? '[]');
    testData = raw.map((item) => DayData.fromRaw(item));

    refreshConstants();
}

readFromLocalStorage();

function filterTags(tags) {
    return tags.filter((tag) => activeTags.has(tag));
}

function getColor(tags) {
    if (tags.length !== 1) {
        return generateRandomHexColor();
    }

    const [tag] = tags;

    for (const currentTag of pageModel.tags) {
        if (currentTag.title === tag) {
            return currentTag.color;
        }
    }

    return generateRandomHexColor();
}

class ChartPageComponent extends Component {
    constructor() {
        super();

        this.canvasId = getId();
    }

    onRender() {
        const ctx = document.getElementById(this.canvasId);

        const labels = testData.map((item) => item.date.toLocaleDateString());

        const getGroup = (tags) => '#' + filterTags(tags).join('# ');

        const groups = new Set();
        const groupToTags = new Map();

        for (const dayItem of testData) {
            for (const taskItem of dayItem.tasks) {
                const group = getGroup(filterTags(taskItem.tags));
                groups.add(group);
                groupToTags.set(group, filterTags(taskItem.tags));
            }
        }

        const sumOfSeconds = (items) => items.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        const datasets = [...groups].map((group) => ({
            label: group,
            data: [
                ...testData.map((item) => {
                    const milliseconds = sumOfSeconds(
                        item.tasks
                            .filter((task) => {
                                if (!filterTags(task.tags).length) {
                                    return false;
                                }

                                return getGroup(filterTags(task.tags)) === group;
                            })
                            .map((task) => task.seconds)
                    );

                    return {
                        date: item.date,
                        label: item.date.toLocaleDateString(),
                        hours: (milliseconds / 1000 / 60 / 60).toFixed(2),
                        seconds: milliseconds / 1000,
                        tags: filterTags(groupToTags.get(group)),
                    };
                }),
            ],
            parsing: {
                xAxisKey: 'label',
                yAxisKey: 'hours',
            },
            backgroundColor: getColor(groupToTags.get(group)),
            fill: true,
        }));

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets,
            },
            options: {
                animations: false,
                "plugins": {
                    legend: {
                        display: false,
                    },
                    "title": {
                        "display": true,
                    },
                    tooltip: {
                        enabled: false,
                        position: 'nearest',
                        external: function(context) {
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
                "responsive": true,
                "scales": {
                    "x": {
                        "stacked": true,
                    },
                    "y": {
                        "stacked": true,
                    },
                },
                "barPercentage": 1,
                "categoryPercentage": 0.98,
            },
        });
    }

    onClickTag(tag, checked) {
        if (checked) {
            activeTags.add(tag);
        } else {
            activeTags.delete(tag);
        }

        this.redraw();
    }

    async selectFiles() {
        testData = [];

        const handles = await window.showOpenFilePicker({
            multiple: true,
            types: [
                {
                    description: 'JSON Files',
                    accept: {
                        'application/json': ['.tapme.json'],
                        'text/csv': ['.tapme.csv'],
                    },
                },
            ],
        });

        const files = await Promise.all(handles.map((handle) => handle.getFile()));
        const filesContents = await Promise.all(files.map((file) => file.text()));

        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            const content = filesContents[index];

            const extension = file.name.split('.').pop();
            const [day, month, year] = file.name.split(' ')[0].split('-');

            const date = new Date(`${year}-${month}-${day}`);

            if (extension === 'json') {
                testData.push(realDataToDayData(date, JSON.parse(content)));
            } else if (extension === 'csv') {
                testData.push(realCsvDataToDayData(date, content));
            }
        }

        refreshConstants();
        saveToLocalStorage();

        this.redraw();
    }

    clearChart() {
        testData = [];

        refreshConstants();
        saveToLocalStorage();

        this.redraw();
    }

    toHtml() {
        setTimeout(() => this.onRender(), 0);

        const tagsComponents = allTags.map((tag) => t`
            <div style="float: left">
                <input
                    type="checkbox"
                    onchange="${(event) => this.onClickTag(tag, event.target.checked)}"
                    ${activeTags.has(tag) ? 'checked' : ''}
                />
                ${tag}
            </div>
        `);

        return t`
            <div class="chart-page-component">
                <div>
                    <button onclick="${() => this.selectFiles()}">Select files</button>
                    <button onclick="${() => this.clearChart()}">Clear</button>
                </div>
                
                <div class="chart-tags-panel">
                    ${tagsComponents}
                </div>

                <canvas id="${this.canvasId}"></canvas>
            </div>
        `;
    }
}
