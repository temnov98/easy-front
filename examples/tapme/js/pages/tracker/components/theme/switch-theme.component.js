class SwitchThemeComponent extends Component {
    toHtml() {
        const switcher = new SwitcherComponent({
            onClick: () => trackerPageModel.toggleTheme(),
            defaultState: trackerPageModel.theme === 'light',
        });

        return t`
            <div class="switch-theme-container">
                ${switcher}
            </div>
        `;
    }
}
