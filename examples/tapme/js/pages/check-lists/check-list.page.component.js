function callNotImplementedAlert() {
    alert('Not implemented yet');
}

class CheckListItemComponent extends Component {
    constructor({ title, selected }) {
        super();

        this.title = title;
        this.selected = selected;
    }

    toHtml() {
        const additionalClassName = this.selected ? 'check-lists-item__selected' : '';

        return t`
            <div class="check-lists-item">
                <div class="hide-by-default check-lists-page-content__selected-row"></div>
                <div
                    onclick="${() => callNotImplementedAlert()}"
                    class="heck-lists-item__text ${additionalClassName}"
                >
                    ${this.title}
                </div>
                <div
                    onclick="${() => callNotImplementedAlert()}"
                    class="check-lists-item__edit-button"
                >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M20.8477 1.87868C19.6761 0.707109 17.7766 0.707105 16.605 1.87868L2.44744 16.0363C2.02864 16.4551 1.74317 16.9885 1.62702 17.5692L1.03995 20.5046C0.760062 21.904 1.9939 23.1379 3.39334 22.858L6.32868 22.2709C6.90945 22.1548 7.44285 21.8693 7.86165 21.4505L22.0192 7.29289C23.1908 6.12132 23.1908 4.22183 22.0192 3.05025L20.8477 1.87868ZM18.0192 3.29289C18.4098 2.90237 19.0429 2.90237 19.4335 3.29289L20.605 4.46447C20.9956 4.85499 20.9956 5.48815 20.605 5.87868L17.9334 8.55027L15.3477 5.96448L18.0192 3.29289ZM13.9334 7.3787L3.86165 17.4505C3.72205 17.5901 3.6269 17.7679 3.58818 17.9615L3.00111 20.8968L5.93645 20.3097C6.13004 20.271 6.30784 20.1759 6.44744 20.0363L16.5192 9.96448L13.9334 7.3787Z" fill="#0F0F0F"></path> </g></svg>
                </div>
                <div
                    onclick="${() => callNotImplementedAlert()}"
                    class="check-lists-item__delete-button"
                >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="trash_24"><path id="Vector" d="M17 6H22V8H20V21C20 21.2652 19.8946 21.5196 19.7071 21.7071C19.5196 21.8946 19.2652 22 19 22H5C4.73478 22 4.48043 21.8946 4.29289 21.7071C4.10536 21.5196 4 21.2652 4 21V8H2V6H7V3C7 2.73478 7.10536 2.48043 7.29289 2.29289C7.48043 2.10536 7.73478 2 8 2H16C16.2652 2 16.5196 2.10536 16.7071 2.29289C16.8946 2.48043 17 2.73478 17 3V6ZM18 8H6V20H18V8ZM9 4V6H15V4H9Z" fill="currentColor"/></g></svg>
                </div>
            </div>
        `
    }
}

class CheckListTaskItemComponent extends Component {
    constructor({ title, selected }) {
        super();

        this.title = title;
        this.selected = selected;

        this.inputId = getId();
    }

    get input() {
        return document.getElementById(this.inputId);
    }

    onClick(event) {
        if (
            event.target.className === 'check-lists-task-item__checkbox' ||
            event.target.className === 'check-lists-task-item__text'
        ) {
            return;
        }

        event.stopPropagation();
        this.input.checked = !this.input.checked;
    }

    toHtml() {
        return t`
            <div class="check-lists-task-item" onclick="${(event) => this.onClick(event)}">
                <input
                    id="${this.inputId}"
                    class="check-lists-task-item__checkbox"
                    type="checkbox"
                    ${this.selected ? 'checked' : ''}
                />
                <label
                    for="${this.inputId}"
                    class="check-lists-task-item__text"
                >
                    ${this.title}
                </label>
            </div>
        `
    }
}

class CheckListsModel extends BaseModel {
    constructor() {
        super();

        this.historyOpened = this.createObservable(false, 'historyOpened');
    }
}

const checkListsModel = new CheckListsModel();

class CheckListHistoryHeaderComponent extends AutoSubscribeComponent {
    onHistoryClick() {
        checkListsModel.historyOpened = !checkListsModel.historyOpened;
    }

    toHtml() {
        return t`
            <div
                class="check-lists-page__history-header"
                onclick="${() => this.onHistoryClick()}"
            >
                <h1>
                    ${checkListsModel.historyOpened ? 'Close history' : 'Open history'}
                </h1>
            </div>
        `;
    }
}

class CheckListPageComponent extends Component {
    constructor() {
        super();

        this.activeTaskCssClass = new CssClass(this.activeTaskCssClassName);
        this.historyCssClass = new CssClass(this.historyCssClassName);

        this.subscribe(checkListsModel.historyOpened).onChange(() => {
            this.activeTaskCssClass.className = this.activeTaskCssClassName;
            this.historyCssClass.className = this.historyCssClassName;
        });
    }

    get activeTaskCssClassName() {
        const additional = checkListsModel.historyOpened
            ? 'check-lists-page-content__right-column__closed'
            : 'check-lists-page-content__right-column__opened';

        return `check-lists-page-content__right-column ${additional}`;
    }

    get historyCssClassName() {
        const additional = checkListsModel.historyOpened ? 'check-lists-page__history__opened' : 'check-lists-page__history__closed';

        return `check-lists-page__history ${additional}`;
    }

    toHtml() {
        setTimeout(() => {
            if (!this._idDestroyed) {
                alert('This is an example of what this page will look like once implemented');
            }
        }, 1000);

        return t`
            <div class="check-lists-page-content">
                <div class="check-lists-page-content__saved-lists">
                    ${new CheckListItemComponent({ title: 'At the end of the working day', selected: false })}
                    ${new CheckListItemComponent({ title: 'Review', selected: false })}
                    ${new CheckListItemComponent({ title: 'Finishing a task', selected: true })}
                    ${new CheckListItemComponent({ title: 'Something else', selected: false })}
                </div>
                <div class="${this.activeTaskCssClass}">
                    <div class="check-lists-page-content__right-column__active-list">
                        <h1>Finishing a task</h1>
                        ${new CheckListTaskItemComponent({ title: 'Check the code', selected: true })}
                        ${new CheckListTaskItemComponent({ title: 'Push changes', selected: true })}
                        ${new CheckListTaskItemComponent({ title: 'Add comments for QA', selected: false })}
                        ${new CheckListTaskItemComponent({ title: 'Set "review" status for a task', selected: false })}
                        ${new CheckListTaskItemComponent({ title: 'Inform the reviewer if the task is important', selected: false })}
                    </div>
                </div>
                <div class="${this.historyCssClass}">
                    ${CheckListHistoryHeaderComponent}
                </div>
            </div>
        `;
    }
}
