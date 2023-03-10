class TasksListComponent extends Component {
    constructor() {
        super();

        this._subscriber = new Subscriber(() => this.redraw());

        pageModel.tasks.connect(this._subscriber);
    }

    onDestroy() {
        pageModel.tasks.disconnect(this._subscriber);
    }

    toHtml() {
        if (!pageModel.tasks.value.length) {
            return t`
                <div>
                    ${TaskPlaceholderComponent}
                </div>
            `;
        }

        return t`
            <div>
                ${pageModel.tasks.value.map((task) => [
                    new TaskComponent(task),
                    new SpaseComponent(5),
                ])}
            </div>
        `;
    }
}
