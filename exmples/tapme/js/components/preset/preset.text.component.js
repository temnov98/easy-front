class PresetTextComponent extends Component {
    constructor(text) {
        super();

        this.text = text;
    }

    toHtml() {
        return t`
            <div class="preset-text">
                ${this.text}
            </div>
        `;
    }
}
