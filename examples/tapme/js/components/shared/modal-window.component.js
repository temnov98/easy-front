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
    toHtml() {
        if (pageModel.modalWindowType === 'delete-active-tasks') {
            return t`
                <div class="modal-window">
                    ${DeleteActiveTasksComponent}
                </div>
            `;
        }

        return t`<div></div>`;
    }
}
