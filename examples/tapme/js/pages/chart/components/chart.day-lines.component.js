// todo: Сделать визуально красиво
class DayLineIntervalTooltipComponent extends Component {
    /**
     * @param {ChartIntervalModel} interval
     */
    constructor({ interval }) {
        super();

        this.interval = interval;
    }

    toHtml() {
        const { title, tags, start, end } = this.interval;

        const tagsLine = tags
            ? '#' + tags.join(', ')
            : '';

        const dateFormatted = start.toLocaleDateString();

        const startFormatted = start.toLocaleTimeString();
        const endFormatted = end.toLocaleTimeString();

        const durationInSeconds = (end.getTime() - start.getTime()) / 1000;
        const durationFormatted = timeFormatService.durationFormatted(durationInSeconds);

        const dayOfWeek = start.toLocaleString(window.navigator.language, { weekday: 'short' });

        return t`
            <div class="chart-page__day-line__interval-tooltip">
                <div>
                    ${dateFormatted} (${dayOfWeek}): ${startFormatted} - ${endFormatted} (${durationFormatted})
                </div>
                <div>
                    ${title}
                </div>
                <div>
                    ${tagsLine}
                </div>
            <div>
        `;
    }
}

class DayLineIntervalComponent extends Component {
    /**
     * @param {number} [percent]
     * @param {ChartIntervalModel} [interval]
     */
    constructor({ percent, interval }) {
        super();

        this.percent = (interval ? interval.percentOfDay : percent) ?? 0;
        this.interval = interval;
    }

    toHtml() {
        const tagToColorMap = trackerPageModel.getTagToColorMap();

        const colors = this.interval
            ? this.interval.tags.map((tag) => tagToColorMap.get(tag) || generateRandomHexColor())
            : [];

        const css = [
            // todo: add multiple colors support
            this.interval ? (colors.length === 1 ? `background: ${colors[0]}` : 'background: red') : '',
            `width: ${this.percent}%`,
        ].join(';');

        return t`
            <div
                class="chart-page__day-line__interval"
                style="${css}"
            >
                ${this.interval ? new DayLineIntervalTooltipComponent({ interval: this.interval }) : ''}
            </div>
        `;
    }
}

class DayLineComponent extends Component {
    /**
     * @param {ChartDayModel} day
     */
    constructor(day) {
        super();

        this.day = day;
    }

    toHtml() {
        const dayDuration = 24 * 60 * 60 * 1000;
        const intervals = [];

        let lastInterval = undefined;

        for (const interval of this.day.intervals) {
            const emptyDuration = lastInterval
                ? interval.start.getTime() - lastInterval.end.getTime()
                : interval.start.getTime() % dayDuration;

            if (emptyDuration > 0) {
                const percentOfDay = (emptyDuration / dayDuration) * 100;

                intervals.push(new DayLineIntervalComponent({ percent: percentOfDay }));
            }

            intervals.push(new DayLineIntervalComponent({ interval }));

            lastInterval = interval;
        }

        return t`
            <div class="chart-page__day-line">
                ${intervals}
            </div>
        `;
    }
}

class ChartDayLinesComponent extends AutoSubscribeComponent {
    toHtml() {
        const days = chartModel.chartData.days
            .map((day) => day) // Copying an array, do not change the original array
            .sort((left, right) => right.date.getTime() - left.date.getTime())
            .map((day) => new DayLineComponent(day));

        return t`
            <div class="chart-page__list-of-days">
                ${days}
            </div>
        `;
    }
}
