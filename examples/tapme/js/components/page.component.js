class PageContentComponent extends AutoSubscribeComponent {
    toHtml() {
        const className = `page page--${pageModel.theme}`;

        return t`
            <div id="main-content" class="${className}">
                ${HeaderComponent}
                ${TasksListComponent}
                ${ButtonsLineComponent}
                ${PresetsListComponent}
                ${SwitchThemeComponent}
            </div>
        `;
    }
}

class PageComponent extends Component {
    toHtml() {
        return t`
            <div>
                ${PageContentComponent}
                ${SwitchThemeComponent}
                ${DebugComponent}
            </div>
        `;
    }
}
