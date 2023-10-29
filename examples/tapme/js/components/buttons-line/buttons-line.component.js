class ButtonsLineComponent extends Component {
    toHtml() {
        return t`
            <div class="row buttons-line">
                <div >${new TotalTimeComponent()}</div>
                <div >${new AddNewTaskComponent()}</div>
                <div >${new AddFromPresetsButtonComponent()}</div>
                <div >${new SaveToFileButtonComponent('json')}</div>
                <div >${new SaveToFileButtonComponent('csv')}</div>
            </div>
        `;
    }
}
