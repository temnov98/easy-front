class ResultTextComponent extends Component {
    toHtml() {
        return t`
            <div class="result-text">
                ${pageModel.resultText}
            </div>
        `;
    }
}

