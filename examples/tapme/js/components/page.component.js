class PageComponent extends AutoSubscribeComponent {
    toHtml() {
        const className = `page page--${pageModel.theme}`;

        return t`
            <div id="main-content" class="${className}">
                ${HeaderComponent}
                ${TasksListComponent}
                ${ButtonsLineComponent}
                ${PresetsListComponent}
                ${DebugComponent}
            </div>
        `;
    }
}
