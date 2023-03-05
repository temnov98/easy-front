class SpaseComponent extends Component {
    constructor(height) {
        super();

        this.height = height;
    }

    toHtml() {
        return t`
            <div style="height: ${this.height}px;"></div>
        `;
    }
}
