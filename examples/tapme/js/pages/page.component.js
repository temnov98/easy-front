const icons = {
    tracker: {
        light: `<svg width="40px" height="40px" viewBox="0 0 24 24" id="alarm" xmlns="http://www.w3.org/2000/svg" class="icon multi-color"><path id="tertiary-fill" d="M20,13A8,8,0,0,1,4,13a8.2,8.2,0,0,1,.14-1.5,8,8,0,0,0,15.72,0A8.2,8.2,0,0,1,20,13Z" style="fill: #b7b7b7; stroke-width: 2;"></path><path id="primary-stroke" d="M19.5,13.5A7.5,7.5,0,1,1,12,6,7.5,7.5,0,0,1,19.5,13.5ZM9,3h6M12,3V6" style="fill: none; stroke: rgb(0, 0, 0); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></path><polyline id="secondary-stroke" points="12 10 12 13 14 15" style="fill: none; stroke: rgb(44, 169, 188); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></polyline></svg>`,
        dark: `<svg width="40px" height="40px" viewBox="0 0 24 24" id="alarm" xmlns="http://www.w3.org/2000/svg" class="icon multi-color" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path id="tertiary-fill" d="M20,13A8,8,0,0,1,4,13a8.2,8.2,0,0,1,.14-1.5,8,8,0,0,0,15.72,0A8.2,8.2,0,0,1,20,13Z" style="fill: #b7b7b7; stroke-width: 2;"></path><path id="primary-stroke" d="M19.5,13.5A7.5,7.5,0,1,1,12,6,7.5,7.5,0,0,1,19.5,13.5ZM9,3h6M12,3V6" style="fill: none; stroke: #c9c9c9; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></path><polyline id="secondary-stroke" points="12 10 12 13 14 15" style="fill: none; stroke: #2ca9bc; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></polyline></g></svg>`,
    },
    chart: {
        light: `<svg width="40px" height="40px" fill="#000000" viewBox="0 0 24 24" id="chart-colum" data-name="Flat Color" xmlns="http://www.w3.org/2000/svg" class="icon flat-color"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><rect id="secondary" x="9.5" y="2" width="5" height="20" rx="1" style="fill: #2ca9bc;"></rect><path id="primary" d="M7,12v9a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1V12a1,1,0,0,1,1-1H6A1,1,0,0,1,7,12ZM21,6H18a1,1,0,0,0-1,1V21a1,1,0,0,0,1,1h3a1,1,0,0,0,1-1V7A1,1,0,0,0,21,6Z" style="fill: #000000;"></path></g></svg>`,
        dark: `<svg width="40px" height="40px" fill="#000000" viewBox="0 0 24 24" id="chart-colum" data-name="Flat Color" xmlns="http://www.w3.org/2000/svg" class="icon flat-color"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><rect id="secondary" x="9.5" y="2" width="5" height="20" rx="1" style="fill: #2ca9bc;"></rect><path id="primary" d="M7,12v9a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1V12a1,1,0,0,1,1-1H6A1,1,0,0,1,7,12ZM21,6H18a1,1,0,0,0-1,1V21a1,1,0,0,0,1,1h3a1,1,0,0,0,1-1V7A1,1,0,0,0,21,6Z" style="fill: #d2d2d2;"></path></g></svg>`,
    },
    checkLists: {
        light: `<svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11 6L21 6.00072M11 12L21 12.0007M11 18L21 18.0007M3 11.9444L4.53846 13.5L8 10M3 5.94444L4.53846 7.5L8 4M4.5 18H4.51M5 18C5 18.2761 4.77614 18.5 4.5 18.5C4.22386 18.5 4 18.2761 4 18C4 17.7239 4.22386 17.5 4.5 17.5C4.77614 17.5 5 17.7239 5 18Z" style="stroke: #000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`,
        dark: `<svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11 6L21 6.00072M11 12L21 12.0007M11 18L21 18.0007M3 11.9444L4.53846 13.5L8 10M3 5.94444L4.53846 7.5L8 4M4.5 18H4.51M5 18C5 18.2761 4.77614 18.5 4.5 18.5C4.22386 18.5 4 18.2761 4 18C4 17.7239 4.22386 17.5 4.5 17.5C4.77614 17.5 5 17.7239 5 18Z" style="stroke: #e0e0e0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`,
    },
    notifications: {
        light: `<svg width="40px" height="40px" fill="#000000" viewBox="0 0 24 24" id="notification-circle" data-name="Flat Line" xmlns="http://www.w3.org/2000/svg" class="icon flat-line"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path id="secondary" d="M18,13V9c0-.06,0-.12,0-.18A3,3,0,0,1,17,9a3,3,0,0,1-3-3,2.94,2.94,0,0,1,1-2.2A5.9,5.9,0,0,0,12,3,6,6,0,0,0,6,9v4L4.62,14.38A2.12,2.12,0,0,0,6.12,18H17.88a2.12,2.12,0,0,0,1.5-3.62Z" style="fill: #2ca9bc; stroke-width: 2;"></path><path id="primary" d="M18,9v4l1.38,1.38A2.12,2.12,0,0,1,17.88,18H6.12a2.12,2.12,0,0,1-1.5-3.62L6,13V9a6,6,0,0,1,6-6,6,6,0,0,1,2.88.73" style="fill: none; stroke: #000000; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></path><path id="primary-2" data-name="primary" d="M12,21h0a3,3,0,0,1-3-3h6A3,3,0,0,1,12,21ZM14,6a3,3,0,0,0,3,3h0a3,3,0,0,0,3-3h0a3,3,0,0,0-3-3h0a3,3,0,0,0-3,3Z" style="fill: none; stroke: #000000; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></path></g></svg>`,
        dark: `<svg width="40px" height="40px" fill="#000000" viewBox="0 0 24 24" id="notification-circle" data-name="Flat Line" xmlns="http://www.w3.org/2000/svg" class="icon flat-line"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path id="secondary" d="M18,13V9c0-.06,0-.12,0-.18A3,3,0,0,1,17,9a3,3,0,0,1-3-3,2.94,2.94,0,0,1,1-2.2A5.9,5.9,0,0,0,12,3,6,6,0,0,0,6,9v4L4.62,14.38A2.12,2.12,0,0,0,6.12,18H17.88a2.12,2.12,0,0,0,1.5-3.62Z" style="fill: #101010; stroke-width: 2;"></path><path id="primary" d="M18,9v4l1.38,1.38A2.12,2.12,0,0,1,17.88,18H6.12a2.12,2.12,0,0,1-1.5-3.62L6,13V9a6,6,0,0,1,6-6,6,6,0,0,1,2.88.73" style="fill: none; stroke: #dadada; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></path><path id="primary-2" data-name="primary" d="M12,21h0a3,3,0,0,1-3-3h6A3,3,0,0,1,12,21ZM14,6a3,3,0,0,0,3,3h0a3,3,0,0,0,3-3h0a3,3,0,0,0-3-3h0a3,3,0,0,0-3,3Z" style="fill: none; stroke: #d3d3d3; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></path></g></svg>`,
    },
};

class PageTabsComponent extends Component {
    constructor() {
        super();

        this.subscribe(themeModel.theme).redrawOnChange();
    }

    toHtml() {
        const tabs = new TabPanelComponent({
            tabs: [
                {
                    key: AvailableTabs.Tracker,
                    content: themeModel.theme === 'light' ? icons.tracker.light : icons.tracker.dark,
                },
                {
                    key: AvailableTabs.Chart,
                    content: themeModel.theme === 'light' ? icons.chart.light : icons.chart.dark,
                },
                {
                    key: AvailableTabs.CheckLists,
                    content: themeModel.theme === 'light' ? icons.checkLists.light : icons.checkLists.dark,
                },
                {
                    key: AvailableTabs.Notifications,
                    content: themeModel.theme === 'light' ? icons.notifications.light : icons.notifications.dark,
                },
            ],
            activeTabKey: tabsModel.activeTabKey,
            onSelect: (key) => tabsModel.changePage(key),
        });

        return t`${tabs}`;
    }
}

class PageComponent extends Component {
    constructor() {
        super();

        this.cssClass = new CssClass(this.cssClassName);

        this.subscribe(themeModel.theme).onChange(() => {
            this.cssClass.className = this.cssClassName;
        });

        this.subscribe(tabsModel.activeTabKey).redrawOnChange();
    }

    get cssClassName() {
        return `page--${themeModel.theme}`;
    }

    toHtml() {
        const pageMapping = {
            [AvailableTabs.Tracker]: TrackerPageComponent,
            [AvailableTabs.Chart]: ChartPageComponent,
            [AvailableTabs.CheckLists]: CheckListPageComponent,
            [AvailableTabs.Notifications]: NotificationsPageComponent,
        };

        const component = pageMapping[tabsModel.activeTabKey] || TrackerPageComponent;

        return t`
            <div class="${this.cssClass}">
                ${PageTabsComponent}
                ${SwitchThemeComponent}
                ${component}
                ${DebugComponent}
                ${UpdatesNotifierComponent}
                ${ModalWindowComponent}
            </div>
        `;
    }
}
