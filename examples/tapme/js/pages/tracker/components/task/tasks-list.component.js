class TasksListComponent extends AutoSubscribeComponent {
    toHtml() {
        if (!trackerPageModel.tasks.length) {
            return t`
                <div>
                    ${TaskPlaceholderComponent}
                </div>
            `;
        }

        const list = new MovableListComponent({
            items: trackerPageModel.tasks.map((task) => new TaskComponent(task)),
            checkAvailability: (target) => target.className.includes('selected-row'),
            onChange: ({ from, to }) => trackerPageModel.moveTasks({ from, to }),
            disableRedrawOnChange: true,
        });

        return t`
            <div class="task-container">
                ${list}
            </div>
        `;
    }
}
