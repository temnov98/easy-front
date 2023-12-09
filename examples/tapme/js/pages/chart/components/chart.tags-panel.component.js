class ChartTagsPanelComponent extends AutoSubscribeComponent {
    toHtml() {
        const tagsComponents = chartModel.chartData.allTags.map((tag) => new ChartTagComponent({
            tag,
            isActive: chartModel.chartData.activeTags.has(tag),
            onClick: (checked) => chartModel.toggleTag(tag, checked),
        }));

        return t`
             <div class="chart-tags-panel">
                 ${tagsComponents}
             </div>
        `;
    }
}
