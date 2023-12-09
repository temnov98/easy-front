class ModalWindowModel extends BaseModel {
    constructor() {
        super();

        this.modalWindowComponent = this.createObservable(undefined, 'modalWindowComponent');

        document.addEventListener('keydown', (event) => this._onKeyDown(event));
    }

    /**
     * @param {Component} component
     */
    openModal(component) {
        this.modalWindowComponent = component;
    }

    closeModal() {
        this.modalWindowComponent = undefined;
    }

    _onKeyDown(event) {
        if (!event || !this.modalWindowComponent) {
            return;
        }

        const key = event.key;

        if (key === 'Escape') {
            this.closeModal();
        }
    }
}

const modalWindowModel = new ModalWindowModel();
