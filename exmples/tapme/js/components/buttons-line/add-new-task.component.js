class AddNewTaskComponent extends Component {
    get currentText() {
        return this._element.value;
    }

    clear() {
        this._element.value = '';
    }

    get _inputId() {
        return `input-${this._id}`;
    }

    get _element() {
        return document.getElementById(this._inputId);
    }

    addTask() {
        const title = this.currentText.trim();
        if (!title) {
            return;
        }

        this.clear();

        pageModel.addTask(new TaskModel({ title }));
    }

    onKeyDown(event) {
        if (event && event.key === 'Enter') {
            this.addTask();
        }
    }

    toHtml() {
        return t`
            <div class="row add-new-task">
                <div>
                    <input id="${this._inputId}" onkeydown="${(event) => this.onKeyDown(event)}">
                </div>
                <div>
                    <button onclick="${() => this.addTask()}">
                        +
                    </button>
                </div>
            </div>
        `;
    }
}
