class TrackerPipSwitchContentComponent extends Component {
    toHtml() {
        return t`<span class="tracker-pip-switch__icon">PiP</span>`;
    }
}

class TrackerPipSwitchComponent extends Component {
    toHtml() {
        if (!trackerPipController.supported) {
            return t`<div></div>`
        }

        const switcher = new SwitcherComponent({
            onClick: () => trackerPipController.toggleEnabled(),
            defaultState: trackerPipController.enabled,
            content: TrackerPipSwitchContentComponent,
        });

        return t`
            <div class="tracker-pip-switch__container" title="Picture-in-Picture">
                ${switcher}
            </div>
        `;
    }
}
