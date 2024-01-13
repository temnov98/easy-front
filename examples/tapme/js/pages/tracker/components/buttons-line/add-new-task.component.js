class AddNewTaskComponent extends Component {
    get currentText() {
        return this._input.value;
    }

    clear() {
        this._input.value = '';
    }

    get _input() {
        return this._element.querySelector('input');
    }

    addTask() {
        const title = this.currentText.trim();
        if (!title) {
            return;
        }

        this.clear();

        trackerPageModel.addTask(new TaskModel({ title }));
    }

    onKeyDown(event) {
        if (event && event.key === 'Enter') {
            this.addTask();
        }
    }

    toHtml() {
        return t`
            <div class="row add-new-task">
                <input
                    class="ym-disable-keys"
                    onkeydown="${(event) => this.onKeyDown(event)}"
                >
                <button onclick="${() => this.addTask()}">
                    +
                </button>
            </div>
        `;
    }
}
