class ButtonsLineComponent extends Component {
    toHtml() {
        return t`
            <div class="row buttons-line">
                <div >${new AddNewTaskComponent()}</div>
                <div >${new AddFromPresetsButtonComponent()}</div>
            </div>
        `;
    }
}
