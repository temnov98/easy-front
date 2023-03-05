class PageComponent extends Component {
    toHtml() {
        return t`
            <div id="main-content" class="page">
                ${HeaderComponent}
                ${TasksListComponent}
                ${ButtonsLineComponent}
                ${PresetsListComponent}
                ${DebugComponent}
            </div>
        `;
    }
}
