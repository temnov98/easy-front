class SwitchThemeContentComponent extends AutoSubscribeComponent {
    get darkIcon() {
        return `
            <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--twemoji" preserveAspectRatio="xMidYMid meet" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><circle fill="#FFD983" cx="18" cy="18" r="18"></circle><path fill="#66757F" d="M0 18c0 9.941 8.059 18 18 18c.295 0 .58-.029.87-.043C24.761 33.393 29 26.332 29 18C29 9.669 24.761 2.607 18.87.044C18.58.03 18.295 0 18 0C8.059 0 0 8.059 0 18z"></path><circle fill="#5B6876" cx="10.5" cy="8.5" r="3.5"></circle><circle fill="#5B6876" cx="20" cy="16" r="3"></circle><circle fill="#5B6876" cx="21.5" cy="27.5" r="3.5"></circle><circle fill="#5B6876" cx="21" cy="6" r="2"></circle><circle fill="#5B6876" cx="3" cy="18" r="1"></circle><circle fill="#FFCC4D" cx="30" cy="9" r="1"></circle><circle fill="#5B6876" cx="15" cy="31" r="1"></circle><circle fill="#FFCC4D" cx="32" cy="19" r="2"></circle><circle fill="#5B6876" cx="10" cy="23" r="2"></circle></g></svg>
        `;
    }

    get lightIcon() {
        return `
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <polygon style="fill:#E8BA44;" points="512,256 463.404,303.361 486.691,367.108 422.306,388.603 415.627,456.15 348.289,447.684 312.961,505.635 256,468.69 199.04,505.635 163.71,447.684 96.372,456.149 89.694,388.603 25.309,367.108 48.597,303.361 0,256 48.597,208.639 25.309,144.892 89.695,123.397 96.373,55.851 163.711,64.316 199.04,6.365 256,43.31 312.961,6.365 348.29,64.316 415.628,55.851 422.306,123.398 486.692,144.893 463.404,208.639 "></polygon> <polygon style="fill:#E49524;" points="512,256 463.404,208.639 486.692,144.893 422.306,123.398 415.628,55.851 348.29,64.316 312.961,6.365 256,43.31 256,468.69 312.961,505.635 348.289,447.684 415.627,456.15 422.306,388.603 486.691,367.108 463.404,303.361 "></polygon> <circle style="fill:#F1D849;" cx="255.996" cy="255.996" r="147.773"></circle> <path style="fill:#E8BA44;" d="M403.778,256c0,81.614-66.162,147.777-147.777,147.777V108.223 C337.616,108.223,403.778,174.386,403.778,256z"></path> </g></svg>
        `;
    }

    toHtml() {
        const icon = themeModel.theme === 'light' ? this.lightIcon : this.darkIcon;

        return t`
            ${icon}
        `;
    }
}

class SwitchThemeComponent extends Component {
    toHtml() {
        const switcher = new SwitcherComponent({
            onClick: () => themeModel.toggleTheme(),
            defaultState: themeModel.theme === 'light',
            content: SwitchThemeContentComponent,
        });

        return t`
            <div class="switch-theme-component__container">
                ${switcher}
            </div>
        `;
    }
}
