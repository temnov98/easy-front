class TotalTimeComponent extends AutoSubscribeComponent {
    toHtml() {
        return t`
            <div class="total-time-container">
                ${pageModel.totalTimeFormatted}
            </div>
        `;
    }
}
