class UpdatesItemComponent extends Component {
    constructor({ date, lines }) {
        super();

        this.date = date;
        this.lines = lines;
    }

    toHtml() {
        return t`
            <div class="updates-modal-window__item">
                <h4>${this.date}:</h4>
                <div>
                    ${this.lines.map((line) => `<div class="updates-modal-window__item__item">- ${line}</div>`)}
                </div>
            </div>
        `;
    }
}

class UpdatesModalWindowComponent extends Component {
    toHtml() {
        const items = updatesList.map((item) => new UpdatesItemComponent(item.content));

        return t`
            <div class="updates-modal-window__container">
                <h2>What's new?</h2>
                ${items}
            </div>
        `;
    }
}

modalWindowModel.registerModal('UpdatesModalWindowComponent', UpdatesModalWindowComponent);
