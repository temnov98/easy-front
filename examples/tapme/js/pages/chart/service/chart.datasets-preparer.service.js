class ChartDatasetsPreparerService {
    static _patternLineWidth = 5;
    static _patternLineSpace = 0;

    /**
     * @param {ChartDayModel[]} days
     * @return {string[]}
     */
    static getLabels(days) {
        return days.map((item) => this._getLabel(item.date));
    }

    /**
     * @param {ChartDayModel[]} days
     * @param {Set<string>} activeTags
     * @param {Map<string, string>} tagToColorMap
     * @param {any} ctx
     * @return {Promise<object[]>}
     */
    static async getDatasets({ days, activeTags, tagToColorMap, ctx }) {
        const groups = new Set();
        const groupToTags = new Map();

        for (const dayItem of days) {
            for (const taskItem of dayItem.tasks) {
                const filteredTags = this._filterTags({
                    tags: taskItem.tags,
                    activeTags,
                });

                const group = this._getGroup({
                    tags: filteredTags,
                    activeTags,
                });

                groups.add(group);
                groupToTags.set(group, filteredTags);
            }
        }

        const datasetsPromises = [...groups].map(async (group) => await this._getDatasetItem({
            days,
            ctx,
            group,
            groupToTags,
            activeTags,
            tagToColorMap,
        }));

        return await Promise.all(datasetsPromises);
    }

    /**
     * @param {ChartDayModel[]} days
     * @param {string} group
     * @param {Map<string, string[]>} groupToTags
     * @param {Set<string>} activeTags
     * @param {Map<string, string>} tagToColorMap
     * @param {object} ctx
     * @return {Promise<object>}
     * @private
     */
    static async _getDatasetItem({ days, group, groupToTags, activeTags, tagToColorMap, ctx }) {
        const backgroundColor = await this._getColor({
            tags: groupToTags.get(group),
            tagToColorMap,
            ctx,
        });

        return {
            label: group,
            data: [
                ...days.map((day) => {
                    const seconds = this._getSeconds({ day, activeTags, group });

                    return {
                        date: day.date,
                        seconds: seconds,
                        tags: this._filterTags({
                            tags: groupToTags.get(group),
                            activeTags,
                        }),
                        label: this._getLabel(day.date),
                        hours: (seconds / 60 / 60).toFixed(2),
                    };
                }),
            ],
            parsing: {
                xAxisKey: 'label',
                yAxisKey: 'hours',
            },
            backgroundColor,
            fill: true,
        };
    }

    /**
     * @param {Date} date
     * @return {string}
     * @private
     */
    static _getLabel(date) {
        const dateFormatted = date.toLocaleDateString();
        const dayOfWeek = date.toLocaleString(window.navigator.language, { weekday: 'short' });

        return `${dateFormatted} (${dayOfWeek})`;
    }

    /**
     * @param {ChartDayModel} day
     * @param {Set<string>} activeTags
     * @param {string} group
     * @return {number}
     * @private
     */
    static _getSeconds({ day, activeTags, group }) {
        const taskSeconds = day.tasks
            .filter((task) => {
                const filteredTags = this._filterTags({
                    tags: task.tags,
                    activeTags,
                });

                if (!filteredTags.length) {
                    return false;
                }

                return this._getGroup({ tags: filteredTags, activeTags }) === group;
            })
            .map((task) => task.seconds);

        return this._sumOfSeconds(taskSeconds);
    }

    /**
     * @param {string[]} tags
     * @param {Set<string>} activeTags
     * @return {string}
     * @private
     */
    static _getGroup({ tags, activeTags }) {
        return '#' + this._filterTags({ tags, activeTags }).join('# ');
    }

    /**
     * @param {string[]} tags
     * @param {Set<string>} activeTags
     * @return {string[]}
     */
    static _filterTags({ tags, activeTags }) {
        return tags.filter((tag) => activeTags.has(tag));
    }

    /**
     * @param {number[]} items
     * @return {number}
     * @private
     */
    static _sumOfSeconds(items) {
        return items.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    }

    /**
     * @param {string[]} tags
     * @param {Map<string, string>} tagToColorMap
     * @param {object} ctx
     * @return {Promise<CanvasPattern|string>}
     * @private
     */
    static async _getColor({ tags, tagToColorMap, ctx }) {
        if (tags.length === 1) {
            return tagToColorMap.get(tags[0]) || generateRandomHexColor();
        }

        if (tags.length > 1) {
            const colors = tags.map((tag) => tagToColorMap.get(tag) || generateRandomHexColor());
            const pattern = await this._drawPattern(colors);

            return ctx.createPattern(pattern, 'repeat');
        }

        return generateRandomHexColor();
    }

    /**
     * @param {string[]} colors
     * @return {Promise<unknown>}
     */
    static _drawPattern(colors) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const edgeSize = Math.max(window.innerWidth, window.innerWidth);
        canvas.width = edgeSize;
        canvas.height = edgeSize;

        let lineWidth = this._patternLineWidth;
        ctx.lineWidth = lineWidth;
        const space = this._patternLineSpace;

        for (let x = 0; x <= canvas.width * 2; x += (lineWidth + space)) {
            ctx.strokeStyle = colors[(x / (lineWidth + space)) % colors.length];
            ctx.beginPath();
            ctx.moveTo(x - canvas.width, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }

        const dataUrl = canvas.toDataURL('image/png');

        let img = new Image();
        img.src = dataUrl;

        return new Promise(resolve => img.onload = () => resolve(img));
    }
}
