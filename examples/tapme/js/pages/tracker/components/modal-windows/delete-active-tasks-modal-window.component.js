class DeleteActiveTasksModalWindowComponent extends Component {
    onDeleteTasks() {
        trackerPageModel.deleteActiveTasks();
        modalWindowModel.closeModal();
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
                        onclick="${() => modalWindowModel.closeModal()}"
                    >
                        No, close window
                    </button>
                </div>
            </div>
        `;
    }
}

modalWindowModel.registerModal('DeleteActiveTasksModalWindowComponent', DeleteActiveTasksModalWindowComponent);
