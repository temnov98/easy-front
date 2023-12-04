class DeleteActiveTasksComponent extends Component {
    onDeleteTasks() {
        pageModel.deleteActiveTasks();
        pageModel.closeModal();
    }

    toHtml() {
        return t`
            <div class="delete-active-tasks-window">
                <h1>Do you want to clear the list of active tasks?</h1>
                <div>
                     <button
                         class="delete-active-tasks-window-red-button"
                         onclick="${() => this.onDeleteTasks()}"
                     >
                        Yes, delete
                    </button>
                    <button
                        class="delete-active-tasks-window-green-button"
                        onclick="${() => pageModel.closeModal()}"
                    >
                        No, close window
                    </button>
                <div>
            </div>
        `;
    }
}

class ModalWindowComponent extends AutoSubscribeComponent {
    constructor() {
        super();

        document.addEventListener('keydown', (event) => this.onKeyDown(event));
    }

    onKeyDown(event) {
        if (!event || !pageModel.modalWindowType) {
            return;
        }

        const key = event.key;

        if (key === 'Escape') {
            pageModel.modalWindowType = undefined;
        }
    }

    onClick(event) {
        if (event?.srcElement?.className === 'modal-window') {
            pageModel.modalWindowType = undefined;
        }
    }

    toHtml() {
        if (pageModel.modalWindowType === 'delete-active-tasks') {
            return t`
                <div class="modal-window" onclick="${(event) => this.onClick(event)}">
                    ${DeleteActiveTasksComponent}
                </div>
            `;
        }

        return t`<div></div>`;
    }
}
