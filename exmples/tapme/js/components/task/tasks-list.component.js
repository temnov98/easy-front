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
        return t`
            <div>
                ${pageModel.tasks.value.map((task) => [
                    new TaskComponent(task),
                    new SpaseComponent(50),
                ])}
            </div>
        `;
    }
}
