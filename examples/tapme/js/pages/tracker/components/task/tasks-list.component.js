class TasksListComponent extends AutoSubscribeComponent {
    toHtml() {
        if (!trackerPageModel.tasks.length) {
            return t`
                <div>
                    ${TaskPlaceholderComponent}
                </div>
            `;
        }

        const tasks = trackerPageModel.tasks.map((task) => [new TaskComponent(task)]);
        const list = new MovableListComponent(tasks, (target) => target.className.includes('selected-row'));

        return t`
            <div class="task-container">
                ${list}
            </div>
        `;
    }
}
