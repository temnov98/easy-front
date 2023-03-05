class TotalTimeComponent extends Component {
    constructor() {
        super();

        pageModel.totalTimeFormatted.connect(new Subscriber(() => this.redraw()));
    }

    toHtml() {
        return t`
            <div class="total-time-container">
                <div>
                    ${pageModel.totalTimeFormatted}
                </div>
            </div>
        `;
    }
}
