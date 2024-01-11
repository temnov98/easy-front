class UpdatesItemComponent extends Component {
    /**
     * @param {Record<string, string>} date
     * @param {Record<string, string>[]}lines
     */
    constructor({ date, lines }) {
        super();

        this.date = date;
        this.lines = lines;
    }

    toHtml() {
        const lines = this.lines.map((line) => {
            const lineLocale = languageModel.t(line);

            return `<div class="updates-modal-window__item__item">- ${lineLocale}</div>`;
        });

        return t`
            <div class="updates-modal-window__item">
                <h4>${languageModel.t(this.date)}:</h4>
                <div>
                    ${lines}
                </div>
            </div>
        `;
    }
}

class UpdatesModalWindowComponent extends Component {
    constructor() {
        super();

        this.subscribe(languageModel.language).redrawOnChange();
    }

    toHtml() {
        const items = updatesList.map((item) => new UpdatesItemComponent(item.content));

        return t`
            <div class="updates-modal-window__container">
                <h2>${languageModel.t(locales.whatsNew.title)}</h2>
                ${items}
            </div>
        `;
    }
}

modalWindowModel.registerModal('UpdatesModalWindowComponent', UpdatesModalWindowComponent);
