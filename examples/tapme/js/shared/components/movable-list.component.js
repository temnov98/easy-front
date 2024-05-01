// https://stackoverflow.com/questions/6073505/what-is-the-difference-between-screenx-y-clientx-y-and-pagex-y
// https://developer.mozilla.org/ru/docs/Web/API/Element/getBoundingClientRect

class MovableListModel extends BaseModel {
    constructor() {
        super();

        this.mouseMoveEvent = this.createObservable(undefined, 'mouseMoveEvent');
        this.mouseUpEvent = this.createObservable(undefined, 'mouseUpEvent');

        window.addEventListener('mousemove', (event) => {
            this.mouseMoveEvent = event;
        });

        window.addEventListener('mouseup', (event) => {
            this.mouseUpEvent = event;
        });
    }
}

const movableListModel = new MovableListModel();

class MovableListComponent extends Component {
    /**
     * @param {Component[]} items
     * @param {(target: Element) => boolean} [checkAvailability]
     * @param {({ from: number; to: number }) => void} [onChange]
     * @param {boolean} [disableRedrawOnChange]
     */
    constructor({ items, checkAvailability, onChange, disableRedrawOnChange }) {
        super();

        this.items = items;
        this.placeholders = items.map(() => undefined);
        this.itemToId = new Map(items.map((item) => [item, getId()]));

        this.checkAvailability = checkAvailability;
        this.onChange = onChange;
        this.disableRedrawOnChange = disableRedrawOnChange;

        this.containerId = getId();

        this.selectedItem = undefined;
        // количество пикселей между top элемента и местом, где был клик по нему.
        this.diffY = 0;
        this.diffX = 0;

        this.subscribe(movableListModel.mouseMoveEvent).onChange(() => this.onMouseMove(movableListModel.mouseMoveEvent));
        this.subscribe(movableListModel.mouseUpEvent).onChange(() => this.onMouseUp());
    }

    /**
     * @param event
     * @param {Component} item
     */
    onMouseDown(event, item) {
        if (this.checkAvailability) {
            try {
                if (!this.checkAvailability(event.target)) {
                    return;
                }
            } catch (error) {
                return;
            }
        }

        const element = document.getElementById(this.getItemId(item));

        const rect = element.getBoundingClientRect();

        // Оба значения (clientY и top) относительно окна браузера (viewport) считаются, поэтому работает
        if (this._isFixedPosition(element)) {
            this.diffY = event.pageY - rect.top;
        } else {
            this.diffY = event.clientY - rect.top;
        }

        this.diffX = event.clientX;

        this.selectedItem = item;
    }

    _isFixedPosition(element) {
        let currentElement = element;

        for (let i = 0; i < 100; i++) {
            if (!currentElement) {
                break;
            }

            if (window.getComputedStyle(currentElement).position === 'fixed') {
                return true;
            }

            currentElement = currentElement.parentElement;
        }

        return false;
    }

    onMouseUp() {
        if (!this.selectedItem) {
            return;
        }

        const item = this.selectedItem;
        this.selectedItem = undefined;

        const currentItemIndex = this.items.findIndex((i) => i === item);
        const placeholderItemIndex = this.placeholders.findIndex((i) => !!i);

        if (placeholderItemIndex < 0) {
            return;
        }

        if (currentItemIndex === placeholderItemIndex) {
            this.redraw();

            return;
        }

        const from = currentItemIndex;
        const to = placeholderItemIndex;

        this.items = moveArrayItem({
            array: this.items,
            from,
            to,
        });

        if (!this.disableRedrawOnChange) {
            this.redraw();
        }

        if (this.onChange) {
            this.onChange({ from, to });
        }
    }

    /**
     * @param event
     */
    onMouseMove(event) {
        if (!this.selectedItem) {
            return;
        }

        const currentItemIndex = this.items.findIndex((i) => i === this.selectedItem);

        const containerRect = document.getElementById(this.containerId).getBoundingClientRect();

        const elementHeight = containerRect.height / this.items.length;
        // Оба значения (clientY и top) относительно окна браузера (viewport) считаются, поэтому работает
        let index = Math.floor((event.clientY - containerRect.top) / elementHeight);
        index = Math.max(0, Math.min(index, this.items.length - 1));

        // TODO: так было бы лучше, но не всегда корректно работает.
        // if (!this.placeholders[index]) {
        //     this.removeAndInsert({ index, currentItemIndex });
        // }

        this.removeAndInsert({ index, currentItemIndex });

        const element = document.getElementById(this.getItemId(this.selectedItem));

        element.style.zIndex = '100';
        element.style.position = 'fixed';
        element.style.top = (event.pageY - this.diffY) + 'px';
        // element.style.left = (event.pageX - this.diffX) + 'px';
    }

    /**
     * @param {number} index
     * @param {number} currentItemIndex
     */
    removeAndInsert({ index, currentItemIndex }) {
        for (let placeholderIndex = 0; placeholderIndex < this.placeholders.length; placeholderIndex++) {
            if (this.placeholders[placeholderIndex]) {
                this.placeholders[placeholderIndex].remove();
                this.placeholders[placeholderIndex] = undefined;
            }
        }

        const element = document.getElementById(this.getItemId(this.items[index]));
        const elementRect = element.getBoundingClientRect();

        const newDiv = document.createElement('div');
        newDiv.style.width = `${elementRect.width}px`;
        newDiv.style.height = `${elementRect.height}px`;

        if (index < currentItemIndex) {
            element.before(newDiv);
        } else {
            element.after(newDiv);
        }

        this.placeholders[index] = newDiv;
    }

    /**
     * @param {Component} item
     * @return {string}
     */
    getItemId(item) {
        return this.itemToId.get(item);
    }

    toHtml() {
        const items = this.items.map((item) => t`
            <div
                id="${this.getItemId(item)}"
                onmousedown="${(event) => this.onMouseDown(event, item)}"
            >
                ${item}
            </div>
        `);

        return t`
            <div id="${this.containerId}">
                ${items}
            <div>
        `;
    }
}
