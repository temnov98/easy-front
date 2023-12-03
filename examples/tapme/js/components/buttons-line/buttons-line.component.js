class ButtonsLineComponent extends Component {
    toHtml() {
        return t`
            <div class="row buttons-line">
                <div>${TotalTimeComponent}</div>
                <div>${AddNewTaskComponent}</div>
                <div>${AddFromPresetsButtonComponent}</div>
                <div>${new SaveToFileButtonComponent('json')}</div>
                <div>${new SaveToFileButtonComponent('csv')}</div>
                <div>${TagsSettingsComponent}</div>
            </div>
        `;
    }
}
