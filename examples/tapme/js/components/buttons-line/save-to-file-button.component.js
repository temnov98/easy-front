class SaveToFileButtonComponent extends Component {
    toHtml() {
        return t`
            <div class="save-icon-container" onmousedown="${() => csvExportService.export(pageModel.tasks.value)}">
                <img class="save-icon" src="images/save.png" alt="Save">
            </div>
        `;
    }
}
