class ChartButtonsPanelComponent extends Component {
    toHtml() {
        return t`
            <div>
                <button onclick="${() => chartModel.selectFiles()}">Select files</button>
                <button onclick="${() => chartModel.clearChart()}">Clear</button>
            </div>
        `;
    }
}
