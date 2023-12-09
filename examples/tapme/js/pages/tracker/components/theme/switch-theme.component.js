class SwitchThemeComponent extends Component {
    toHtml() {
        const switcher = new SwitcherComponent({
            onClick: () => themeModel.toggleTheme(),
            defaultState: themeModel.theme === 'light',
        });

        return t`
            <div class="switch-theme-container">
                ${switcher}
            </div>
        `;
    }
}
