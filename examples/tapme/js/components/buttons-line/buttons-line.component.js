class ButtonsLineComponent extends Component {
    toHtml() {
        return t`
            <div class="row">
                <div class="column max-width"></div>
                <div class="column">${new AddNewTaskComponent()}</div>
                <div class="column">${new AddFromPresetsButtonComponent()}</div>
            </div>
        `;
    }
}
