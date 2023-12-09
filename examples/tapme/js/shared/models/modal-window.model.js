class ModalWindowModel extends BaseModel {
    constructor() {
        super();

        this.modalWindowsMapping = new Map();

        this.modalWindowComponent = this.createObservable(undefined, 'modalWindowComponent');

        document.addEventListener('keydown', (event) => this._onKeyDown(event));
    }

    registerModal(modalWindowName, componentClass) {
        this.modalWindowsMapping.set(modalWindowName, componentClass);
    }

    /**
     * @param {string} modalWindowName
     * @param {object} [props]
     */
    openModal(modalWindowName, props) {
        if (this.modalWindowComponent) {
            return;
        }

        const componentClass = this.modalWindowsMapping.get(modalWindowName);
        if (!componentClass) {
            console.warn(`Modal window is not registered: ${modalWindowName}`);

            return;
        }

        this.modalWindowComponent = new componentClass(props);
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
