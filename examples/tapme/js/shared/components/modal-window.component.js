class ModalWindowComponent extends AutoSubscribeComponent {
    constructor() {
        super();

        this.containerId = getId();
    }

    onClick(event) {
        if (event?.srcElement?.id === this.containerId) {
            modalWindowModel.closeModal();
        }
    }

    toHtml() {
        if (!modalWindowModel.modalWindowComponent) {
            return t`<div></div>`;
        }

        return t`
            <div id="${this.containerId}" class="modal-window__component" onclick="${(event) => this.onClick(event)}">
                ${modalWindowModel.modalWindowComponent}
            </div>
        `;
    }
}
