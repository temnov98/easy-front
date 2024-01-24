class TotalTime extends AutoSubscribeComponent {
    toHtml() {
        return t`
            <p class="total-time">
                ${trackerPageModel.totalTimeFormatted}
            </p>
        `;
    }
}

class FirstTouch extends AutoSubscribeComponent {
    constructor() {
        super();

        this.subscribe(languageModel.language).redrawOnChange();
    }

    toHtml() {
        const title = languageModel.t(locales.firstTouchTitle);

        return t`
            <p class="first-touch" data-before-text="${title}">
                ${trackerPageModel.timeOfFirstTouchToday}
            </p>
        `;
    }
}

class TotalTimeComponent extends Component {
    toHtml() {
        return t`
            <div class="summary-badge">
                ${TotalTime}
                ${FirstTouch}
            </div>
        `;
    }
}
