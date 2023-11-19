class ResultTextComponent extends AutoSubscribeComponent {
    toHtml() {
        return t`
            <div class="result-text">
                ${pageModel.resultText}
            </div>
        `;
    }
}

