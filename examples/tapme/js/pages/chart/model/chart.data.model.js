class ChartDataModel {
    /**
     * @param {ChartDayModel[]} days
     * @param {string} allTags
     * @param {Set<string>} activeTags
     */
    constructor({ days, allTags, activeTags }) {
        this.days = days;
        this.allTags = allTags;
        this.activeTags = activeTags;
    }
}
