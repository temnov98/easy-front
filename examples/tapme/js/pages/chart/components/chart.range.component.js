class ChartRangeComponent extends Component {
    toHtml() {
        return t`
            <div>
                ${new RangeComponent({
                    min: chartModel.min,
                    max: chartModel.max,
                    onChange: ({ min, max }) => chartModel.setInterval({ min, max }),
                })}
            </div>
        `;
    }
}
