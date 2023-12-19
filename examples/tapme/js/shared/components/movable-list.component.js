class MovableListComponent extends Component {
    /**
     * @param {Component[]} items
     * @param {(target) => boolean} [checkAvailability]
     */
    constructor(items, checkAvailability) {
        super();

        this.items = items;
        this.itemsAfters = items.map(() => undefined);
        this.itemToId = new Map(items.map((item) => [item, getId()]));

        this.checkAvailability = checkAvailability;

        this.containerId = getId();

        this.selectedItem = undefined;
        this.diffY = 0;
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

        this.diffY = event.clientY - element.getBoundingClientRect().top;
        this.selectedItem = item;
    }

    /**
     * @param event
     * @param {Component} item
     */
    onMouseUp(event, item) {
        if (!this.selectedItem) {
            return;
        }

        this.selectedItem = undefined;

        const currentItemIndex = this.items.findIndex((i) => i === item);
        const placeholderItemIndex = this.itemsAfters.findIndex((i) => !!i);

        if (currentItemIndex === placeholderItemIndex) {
            this.redraw();

            return;
        }

        const newItems = this.items.filter((i, index) => index !== currentItemIndex);
        newItems.splice(placeholderItemIndex, 0, item);

        this.items = newItems;

        this.redraw();
    }

    /**
     * @param event
     * @param {Component} item
     */
    onMouseMove(event, item) {
        if (this.selectedItem !== item) {
            return;
        }

        const currentItemIndex = this.items.findIndex((i) => i === item);

        const containerRect = document.getElementById(this.containerId).getBoundingClientRect();

        const elementHeight = containerRect.height / this.items.length;
        let index = Math.floor((event.clientY - containerRect.top) / elementHeight);
        index = Math.max(0, Math.min(index, this.items.length - 1));

        // TODO: так было бы лучше, но не всегда корректно работает.
        // if (!this.itemsAfters[index]) {
        //     this.removeAndInsert({ index, currentItemIndex });
        // }

        this.removeAndInsert({ index, currentItemIndex });

        const element = document.getElementById(this.getItemId(item));

        element.style.zIndex = '100';
        element.style.position = 'absolute';
        element.style.top = (event.clientY - this.diffY) + 'px';
    }

    /**
     * @param {number} index
     * @param {number} currentItemIndex
     */
    removeAndInsert({ index, currentItemIndex }) {
        for (let afterIndex = 0; afterIndex < this.itemsAfters.length; afterIndex++) {
            if (this.itemsAfters[afterIndex]) {
                this.itemsAfters[afterIndex].remove();
                this.itemsAfters[afterIndex] = undefined;
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

        this.itemsAfters[index] = newDiv;
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
                onmouseup="${(event) => this.onMouseUp(event, item)}"
                onmousemove="${(event) => this.onMouseMove(event, item)}"
                onmouseleave="${(event) => this.onMouseUp(event, item)}"
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
