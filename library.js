const _componentIdPrefix = 'easy-front-component-id-';
const _handlerIdPrefix = 'easy-front-handler-id-';
const _cssClassIdPrefix = 'easy-front-css-class-id-';
const _subscriberIdPrefix = 'easy-front-subscriber-id-';
const _observableValueIdPrefix = 'easy-front-observable-value-id-';

class _Logger {
    constructor() {
        this.errorsCount = 0;
    }

    log(...args) {
        console.log(...args);
    }

    error(...args) {
        this.errorsCount++;
        console.error(...args);
    }
}

const _logger = new _Logger();

/**
 * @returns {function(prefix: string): string}
 */
function _getIdGenerator() {
    let id = 0;

    /**
     * @param {string} prefix
     * @return {string}
     */
    return function result(prefix) {
        return `${prefix}${id++}`;
    }
}

const _getId = _getIdGenerator();

/** @type {Map<string, function>} */
const _globalFunctions = new Map();

/**
 * @typedef {{ _toHtml: () => string } | CssClass | function | ParamType[] | any} ParamType
 */

/**
 * @param {ParamType} param
 * @returns {string}
 */
function _prepareParam(param) {
    if (Array.isArray(param)) {
        return param.map((item) => _prepareParam(item)).join('');
    }

    if (param && param._toHtml) {
        return param._toHtml();
    }

    if (param instanceof CssClass) {
        return param._insertValue();
    }

    if (param?.prototype?._toHtml) {
        return new param()._toHtml();
    }

    if (typeof param === 'function') {
        const id = _getId(_handlerIdPrefix);

        _globalFunctions.set(id, param);

        return `_globalFunctions.get('${id}')(event)`;
    }

    return param;
}

/**
 * @param {string} str
 * @param {any} params
 * @returns {string}
 */
function t(str, ...params) {
    params.push('');

    let result = '';

    for (let index = 0; index < str.length; index++) {
        result = result + str[index] + _prepareParam(params[index]);
    }

    return result;
}

/**
 * @param {string} id
 * @param {Component} page
 */
function initPage(id, page) {
    document.getElementById(id).innerHTML = page._toHtml();
}

/** @type {Map<string, Component>} */
const _idToComponentMapping = new Map();

// Base class for components
class Component {
    constructor() {
        this._id = _getId(_componentIdPrefix);
        this._idDestroyed = false;

        _idToComponentMapping.set(this._id, this);
    }

    /**
     * @returns {string}
     */
    toHtml() {
        _logger.error('Should implement toHtml()');

        return '';
    }

    /**
     * @returns {void}
     */
    onDestroy() {
        // should be implemented
    }

    /**
     * @returns {void}
     */
    _onDestroy() {
        this._idDestroyed = true;
        this.onDestroy();
    }

    /**
     * @returns {boolean}
     */
    redraw() {
        if (this._idDestroyed) {
            return true;
        }

        try {
            const idsBefore = this._innerIds;

            this._element.innerHTML = this.toHtml();

            this._deleteUseless(idsBefore);

            return true;
        } catch (error) {
            _logger.error(`Error on redrawing (id = ${this._id}): ${error.message}`, this);

            return false;
        }
    }

    /**
     * @param {string[]} idsBefore
     */
    _deleteUseless(idsBefore) {
        const idsAfter = new Set(this._innerIds);

        for (const id of idsBefore) {
            if (id === this._id) {
                continue;
            }

            if (idsAfter.has(id)) {
                continue;
            }

            const component = _idToComponentMapping.get(id);
            const handler = _globalFunctions.get(id);

            if (!component && !handler) {
                _logger.error(`Component/handler (id = ${id}) not found for deleting`);
                continue;
            }

            if (component) {
                component._onDestroy();

                _idToComponentMapping.delete(id);
            }

            if (handler) {
                _globalFunctions.delete(id);
            }
        }
    }

    get _element() {
        return document.getElementById(this._id);
    }

    /**
     * @returns {string[]}
     */
    get _innerIds() {
        const componentRegexp = new RegExp(_componentIdPrefix + '\\d+', 'g');
        const handlerRegexp = new RegExp(_handlerIdPrefix + '\\d+', 'g');

        const innerHTML = this._element.innerHTML;

        return [
            ...(innerHTML.match(componentRegexp) ?? []),
            ...(innerHTML.match(handlerRegexp) ?? []),
        ];
    }

    /**
     * @returns {string}
     */
    _toHtml() {
        return t`
            <div id="${this._id}">
                ${this.toHtml()}
            </div>
        `;
    }

    /**
     * @template T
     * @param {T} value
     * @param {string} fieldName
     * @returns {T}
     */
    createRedrawable(value, fieldName) {
        let init = true;
        const key = Symbol('RedrawableValueSymbol');

        const self = this;

        Object.defineProperty(self, fieldName, {
            set: (setValue) => {
                self[key] = setValue;

                if (init) {
                    init = false;
                } else {
                    self.redraw();
                }
            },
            get: () => {
                return self[key];
            }
        });

        return value;
    }
}

// usage: <div class="${this.cssClass}"><div>
class CssClass {
    /**
     * @param {string} className
     */
    constructor(className) {
        this._id = _getId(_cssClassIdPrefix);
        this._className = className;
    }

    /**
     * @returns {string}
     */
    get className() {
        return this._className;
    }

    /**
     * @param {string} className
     */
    set className(className) {
        try {
            const element = document.getElementById(this._id);

            element.className = className;

            this._className = className;
        } catch (error) {
            _logger.error(`Error on changing class name (id: ${this._id}, old class name: ${this._className}, new class name: ${className}): ${error.message}`);
        }
    }

    /**
     * @returns {string}
     */
    _insertValue() {
        return `${this._className}" id="${this._id}`;
    }
}

class Subscriber {
    /**
     * @param {(value: any) => void} handler
     */
    constructor(handler) {
        this.id = _getId(_subscriberIdPrefix);
        this.handler = handler;
    }
}

// Use it for models
class ObservableValue {
    /**
     * @param {any} value
     */
    constructor(value) {
        this.id = _getId(_observableValueIdPrefix);
        this._value = value;

        /** @type {Array<Subscriber>} */
        this._subscribers = [];
    }

    /**
     * @param {Subscriber} subscriber
     * @returns {void}
     */
    connect(subscriber) {
        this._subscribers.push(subscriber);
    }

    /**
     * @param {Subscriber} subscriber
     * @returns {void}
     */
    disconnect(subscriber) {
        this._subscribers = this._subscribers.filter((currentSubscriber) => currentSubscriber.id !== subscriber.id);
    }

    /**
     * @returns {any}
     */
    get value() {
        return this._value;
    }

    /**
     * @param {any} value
     */
    set value(value) {
        this._value = value;

        for (const subscriber of this._subscribers) {
            subscriber.handler(value);
        }
    }
}

class EasyFrontDebugComponent extends Component {
    /**
     * @param {Object} [params]
     * @param {string} [params.mainClass]
     * @param {string} [params.componentsCountClass]
     * @param {string} [params.handlersCountClass]
     * @param {string} [params.errorsCountClass]
     * @param {number} [params.updateInterval]
     */
    constructor(params) {
        super();

        this.params = params;

        this.timer = setInterval(() => this.redraw(), this.params?.updateInterval ?? 1000);
    }

    onDestroy() {
        clearInterval(this.timer);
    }

    toHtml() {
        const {
            mainClass = '',
            componentsCountClass = '',
            handlersCountClass = '',
            errorsCountClass = '',
        } = this.params ?? {};

        const main = mainClass ? `class="${mainClass}"` : `style="${[
            'position: fixed;',
            'left: 10px;',
            'top: 10px;',
            'font-size: 20px;',
            'background-color: rgba(188, 188, 188, 0.45);',
            'padding: 10px;',
        ].join(';')}"`;

        const componentsCount = componentsCountClass ? `class="${componentsCountClass}"` : `style="${[
            'color: #183ce5;',
        ].join(';')}"`;

        const handlersCount = handlersCountClass ? `class="${handlersCountClass}"` : `style="${[
            'color: #3a6d15;',
        ].join(';')}"`;

        const errorsCount = errorsCountClass ? `class="${errorsCountClass}"` : `style="${[
            'color: red;',
        ].join(';')}"`;

        return t`
            <div ${main}>
                <div ${componentsCount}>
                    Components count: ${_idToComponentMapping.size}
                </div>
                <div ${handlersCount}>
                    Handlers count: ${_globalFunctions.size}
                </div>
                <div ${errorsCount}>
                    Errors count: ${_logger.errorsCount}
                </div>
            </div>
        `;
    }
}
