class TasksListComponent extends AutoSubscribeComponent {
    toHtml() {
        if (!trackerPageModel.tasks.length) {
            return t`
                <div>
                    ${TaskPlaceholderComponent}
                </div>
            `;
        }

        return t`
            <div class="task-container">
                ${trackerPageModel.tasks.map((task) => [
                    new TaskComponent(task),
                ])}
            </div>
        `;
    }
}
