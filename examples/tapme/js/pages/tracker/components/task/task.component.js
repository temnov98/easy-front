class TaskEditIntervalsButtonWrapper extends Component {
    /**
     * @param {TaskModel} task
     */
    constructor(task) {
        super();

        this.task = task;
    }

    toHtml() {
        return t`
            <div class="hide-by-default">
                ${new TaskEditIntervalsButtonComponent(this.task)}
            </div>
        `;
    }
}

class TaskComponent extends Component {
    /**
     * @param {TaskModel} task
     */
    constructor(task) {
        super();

        this.task = task;

        this.subscribe(experimentalFeatureModel.updatedAt).redrawOnChange();
    }

    toHtml() {
        const isTimeIntervalEditingEnabled = experimentalFeatureModel.isFeatureEnabled(ExperimentalFeature.TimeIntervalEditing);

        return t`
            <div class="row task-component-container">
                <div class="hide-by-default selected-row"></div>

                <div class="row task-component">
                    <div>${new TaskToggleButtonComponent(this.task)}</div>
                    <div class="max-width">${new TaskTextComponent(this.task)}</div>
                    ${isTimeIntervalEditingEnabled ? new TaskEditIntervalsButtonWrapper(this.task) : ''}
                    <div class="hide-by-default">${new TaskSaveAsPresetButtonComponent(this.task)}</div>
                    <div class="hide-by-default">
                        ${new DeleteButtonComponent(() => trackerPageModel.deleteTask(this.task))}
                    </div>
                </div>

                <div>
                    ${new TagsBlockComponent(this.task)}
                </div>
            </div>
        `;
    }
}
