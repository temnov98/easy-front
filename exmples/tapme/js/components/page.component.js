class PageComponent extends Component {
    toHtml() {
        return t`
            <div id="main-content" class="page">
                ${new TasksListComponent()}
                ${new ButtonsLineComponent()}
                ${new PresetsListComponent()}
                ${new DebugComponent()}
            </div>
        `;
    }
}
