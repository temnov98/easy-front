class TrackerPipSwitchContentComponent extends Component {
    toHtml() {
        return t`<span class="tracker-pip-switch__icon">PiP</span>`;
    }
}

class TrackerPipSwitchComponent extends Component {
    toHtml() {
        if (!trackerPipService.supported) {
            return t`<div></div>`;
        }

        const switcher = new SwitcherComponent({
            onClick: () => trackerPipService.toggleEnabled(),
            defaultState: trackerPipService.enabled,
            content: TrackerPipSwitchContentComponent,
        });

        return t`
            <div class="tracker-pip-switch__container" title="Picture-in-Picture">
                ${switcher}
            </div>
        `;
    }
}
