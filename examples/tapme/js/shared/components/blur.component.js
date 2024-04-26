class BlurModeButtonContentComponent extends Component {
    constructor() {
        super();

        this.subscribe(blurModel.blurMode).redrawOnChange();
        this.subscribe(themeModel.theme).redrawOnChange();
    }

    get blurModeDisabledLightThemeIcon() {
        return `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12Z" fill="#1C274C"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M2 12C2 13.6394 2.42496 14.1915 3.27489 15.2957C4.97196 17.5004 7.81811 20 12 20C16.1819 20 19.028 17.5004 20.7251 15.2957C21.575 14.1915 22 13.6394 22 12C22 10.3606 21.575 9.80853 20.7251 8.70433C19.028 6.49956 16.1819 4 12 4C7.81811 4 4.97196 6.49956 3.27489 8.70433C2.42496 9.80853 2 10.3606 2 12ZM12 8.25C9.92893 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92893 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25Z" fill="#1C274C"></path> </g></svg>
        `;
    }

    get blurModeEnabledLightThemeIcon() {
        return `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.4" d="M9.76057 14.3667C9.18557 13.7927 8.83557 13.0127 8.83557 12.1377C8.83557 10.3847 10.2476 8.97168 11.9996 8.97168C12.8666 8.97168 13.6646 9.32268 14.2296 9.89668" stroke="#fcfcfc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path opacity="0.4" d="M15.1047 12.6987C14.8727 13.9887 13.8567 15.0067 12.5677 15.2407" stroke="#fcfcfc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M6.65451 17.4722C5.06751 16.2262 3.72351 14.4062 2.74951 12.1372C3.73351 9.85823 5.08651 8.02823 6.68351 6.77223C8.27051 5.51623 10.1015 4.83423 11.9995 4.83423C13.9085 4.83423 15.7385 5.52623 17.3355 6.79123" stroke="#fcfcfc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M19.4475 8.99072C20.1355 9.90472 20.7405 10.9597 21.2495 12.1367C19.2825 16.6937 15.8065 19.4387 11.9995 19.4387C11.1365 19.4387 10.2855 19.2987 9.46753 19.0257" stroke="#fcfcfc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M19.8868 4.24951L4.11279 20.0235" stroke="#fcfcfc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
        `;
    }

    get blurModeDisabledDarkThemeIcon() {
        return `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12Z" fill="#fafafa"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M2 12C2 13.6394 2.42496 14.1915 3.27489 15.2957C4.97196 17.5004 7.81811 20 12 20C16.1819 20 19.028 17.5004 20.7251 15.2957C21.575 14.1915 22 13.6394 22 12C22 10.3606 21.575 9.80853 20.7251 8.70433C19.028 6.49956 16.1819 4 12 4C7.81811 4 4.97196 6.49956 3.27489 8.70433C2.42496 9.80853 2 10.3606 2 12ZM12 8.25C9.92893 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92893 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25Z" fill="#fafafa"></path> </g></svg>
        `;
    }

    get blurModeEnabledDarkThemeIcon() {
        return `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.4" d="M9.76057 14.3667C9.18557 13.7927 8.83557 13.0127 8.83557 12.1377C8.83557 10.3847 10.2476 8.97168 11.9996 8.97168C12.8666 8.97168 13.6646 9.32268 14.2296 9.89668" stroke="#121212" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path opacity="0.4" d="M15.1047 12.6987C14.8727 13.9887 13.8567 15.0067 12.5677 15.2407" stroke="#121212" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M6.65451 17.4722C5.06751 16.2262 3.72351 14.4062 2.74951 12.1372C3.73351 9.85823 5.08651 8.02823 6.68351 6.77223C8.27051 5.51623 10.1015 4.83423 11.9995 4.83423C13.9085 4.83423 15.7385 5.52623 17.3355 6.79123" stroke="#121212" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M19.4475 8.99072C20.1355 9.90472 20.7405 10.9597 21.2495 12.1367C19.2825 16.6937 15.8065 19.4387 11.9995 19.4387C11.1365 19.4387 10.2855 19.2987 9.46753 19.0257" stroke="#121212" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M19.8868 4.24951L4.11279 20.0235" stroke="#121212" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
        `;
    }

    get lightIcon() {
        return blurModel.blurMode === BlurMode.Enabled
            ? this.blurModeEnabledLightThemeIcon
            : this.blurModeDisabledLightThemeIcon;
    }

    get darkIcon() {
        return blurModel.blurMode === BlurMode.Enabled
            ? this.blurModeEnabledDarkThemeIcon
            : this.blurModeDisabledDarkThemeIcon;
    }

    toHtml() {
        const icon = themeModel.theme === 'light' ? this.lightIcon : this.darkIcon;

        return t`
            ${icon}
        `;
    }
}

class BlurScreenContainer extends AutoSubscribeComponent {
    toHtml() {
        if (blurModel.blurMode === BlurMode.Enabled) {
            return t`
                <div class="blur-screen-component__container"></div>
            `;
        }

        return t`
            <div></div>
        `;
    }
}

class BlurComponent extends Component {
    toHtml() {
        const switcher = new SwitcherComponent({
            onClick: () => blurModel.toggleBlurMode(),
            defaultState: blurModel.blurMode === BlurMode.Disabled,
            content: BlurModeButtonContentComponent,
        });

        return t`
            <div class="switch-blur-mode-component__container">
                ${switcher}
            </div>
        `;
    }
}
