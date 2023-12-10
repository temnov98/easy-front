class ChartRangeComponent extends AutoSubscribeComponent {
    toHtml() {
        return t`
            <div>
                ${new RangeComponent({
                    min: 0,
                    max: chartModel.daysCount - 1,
                    minValue: chartModel.min,
                    maxValue: chartModel.max,
                    onChange: ({ min, max }) => chartModel.setInterval({ min, max }),
                })}
            </div>
        `;
    }
}
