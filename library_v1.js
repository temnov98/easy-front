const _easyFrontVersion = 1;

const _containerTagName = 'easy-front-container';

const _componentIdPrefix = 'easy-front-component-id-';
const _handlerIdPrefix = 'easy-front-handler-id-';
const _subscriberIdPrefix = 'easy-front-subscriber-id-';
const _observableValueIdPrefix = 'easy-front-observable-value-id-';

const _dataAttributeNames = {
    cssClassId: 'data-easy-front-css-class-id',
    redrawableId: 'data-easy-front-redrawable-id',
};

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

    if (param instanceof ObservableValue) {
        return _prepareParam(param.value);
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
     * @param {boolean} replace
     * @returns {boolean}
     */
    redraw(replace = false) {
        if (this._idDestroyed) {
            return true;
        }

        try {
            let idsBefore;
            if (replace) {
                idsBefore = this._outerIds;
                this._element.outerHTML = this._toHtml();
            } else {
                idsBefore = this._innerIds;
                this._element.innerHTML = this.toHtml();
            }


            this._deleteUseless(idsBefore, replace);

            return true;
        } catch (error) {
            _logger.error(`Error on redrawing (id = ${this._id}): ${error.message}`, this);

            return false;
        }
    }

    /**
     * @param {boolean} replace
     * @param {string[]} idsBefore
     */
    _deleteUseless(idsBefore, replace) {
        const idsAfter = new Set(replace ? this._outerIds : this._innerIds);

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
        return this._getIdsFormElement(this._element.innerHTML)
    }

    /**
     * @returns {string[]}
     */
    get _outerIds() {
        return this._getIdsFormElement(this._element.outerHTML)
    }

    /**
     * @param {string} elementStr
     * @returns {string[]}
     */
    _getIdsFormElement(elementStr) {
        // TODO: pattern should be started with '^'
        const componentRegexp = new RegExp(_componentIdPrefix + '\\d+', 'g');
        const handlerRegexp = new RegExp(_handlerIdPrefix + '\\d+', 'g');

        const innerHTML = elementStr;

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
    createFullRedrawable(value, fieldName) {
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

        const redrawableId = _getId('');

        Object.defineProperty(self, fieldName, {
            set: (setValue) => {
                self[key] = setValue;

                if (init) {
                    init = false;
                } else {
                    document
                        .querySelectorAll(`[${_dataAttributeNames.redrawableId}="${redrawableId}"]`)
                        .forEach((element) => element.innerHTML = self[key]);
                }
            },
            get: () => {
                let storedValue = self[key];

                if (storedValue === null || storedValue === undefined) {
                    return storedValue;
                }

                if (typeof storedValue === 'string') {
                    storedValue = new String(storedValue);
                }

                if (typeof storedValue === 'number') {
                    storedValue = new Number(storedValue);
                }

                if (typeof storedValue === 'boolean') {
                    storedValue = new Boolean(storedValue);
                }

                storedValue._toHtml = () => t`<${_containerTagName} ${_dataAttributeNames.redrawableId}="${redrawableId}">${self[key]}</${_containerTagName}>`;

                return storedValue;
            },
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
        this._id = _getId('');
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
            const [element] = document.querySelectorAll(`[${_dataAttributeNames.cssClassId}="${this._id}"]`);

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
        return `${this._className}" ${_dataAttributeNames.cssClassId}="${this._id}`;
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

class BaseModel {
    constructor() {
        this._fieldNameToSymbol = new Map();
    }

    /**
     * @template T
     * @param {T} value
     * @param {string} fieldName
     * @returns {T}
     */
    createObservable(value, fieldName) {
        let init = true;
        const key = Symbol('ObservableValueSymbol');
        this._fieldNameToSymbol.set(fieldName, key);

        const self = this;

        Object.defineProperty(self, fieldName, {
            set: (setValue) => {
                if (init) {
                    self[key] = new ObservableValue(setValue);

                    init = false;
                } else {
                    self[key].value = setValue;
                }
            },
            get: () => {
                return self[key].value;
            },
        });

        return value;
    }

    /**
     * @param {string} fieldName
     * @param {Subscriber} subscriber
     * @returns {void}
     */
    connect(fieldName, subscriber) {
        const key = this._fieldNameToSymbol.get(fieldName);

        this[key].connect(subscriber);
    }

    /**
     * @param {string} fieldName
     * @param {Subscriber} subscriber
     * @returns {void}
     */
    disconnect(fieldName, subscriber) {
        const key = this._fieldNameToSymbol.get(fieldName);

        this[key].disconnect(subscriber);
    }
}
