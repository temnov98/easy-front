class SwitchThemeComponent extends Component {
    toHtml() {
        const switcher = new SwitcherComponent({
            onClick: () => pageModel.toggleTheme(),
            defaultState: pageModel.theme === 'light',
        });

        return t`
            <div class="switch-theme-container">
                ${switcher}
            </div>
        `;
    }
}
