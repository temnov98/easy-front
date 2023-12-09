class TotalTimeComponent extends AutoSubscribeComponent {
    toHtml() {
        return t`
            <div class="total-time-container">
                ${trackerPageModel.totalTimeFormatted}
            </div>
        `;
    }
}
