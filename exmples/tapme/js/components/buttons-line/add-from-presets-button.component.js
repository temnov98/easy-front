class AddFromPresetsButtonComponent extends Component {
    toHtml() {
        return t`
            <button class="add-from-presets-button" onclick="${() => pageModel.addTasksFromPresets()}">
                Add from presets
            </button>
        `;
    }
}
