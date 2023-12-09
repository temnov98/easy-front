class TasksListComponent extends AutoSubscribeComponent {
    toHtml() {
        if (!pageModel.tasks.length) {
            return t`
                <div>
                    ${TaskPlaceholderComponent}
                </div>
            `;
        }

        return t`
            <div class="task-container">
                ${pageModel.tasks.map((task) => [
                    new TaskComponent(task),
                ])}
            </div>
        `;
    }
}
