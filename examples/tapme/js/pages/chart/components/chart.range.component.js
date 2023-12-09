class ChartRangeComponent extends Component {
    toHtml() {
        return t`
            <div>
                ${new RangeComponent({
                    min: 0,
                    max: chartModel._days.length - 1,
                    minValue: chartModel.min,
                    maxValue: chartModel.max,
                    onChange: ({ min, max }) => chartModel.setInterval({ min, max }),
                })}
            </div>
        `;
    }
}
