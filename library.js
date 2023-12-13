const _easyFrontVersion = '2.0.7';

const _easyFrontConfig = {
    logging: {
        renderComponents: false,
        executeHandlers: false,
        autoSubscribing: false,
    },
};

const _containerTagName = 'easy-front-container';

const _modelIdPrefix = 'easy-front-model-id-';
const _componentIdPrefix = 'easy-front-component-id-';
const _handlerIdPrefix = 'easy-front-handler-id-';
const _subscriberIdPrefix = 'easy-front-subscriber-id-';
const _observableValueIdPrefix = 'easy-front-observable-value-id-';

const _dataAttributeNames = {
    componentId: 'data-easy-front-component-id',
    cssClassId: 'data-easy-front-css-class-id',
    redrawableId: 'data-easy-front-redrawable-id',
};

class _Logger {
    constructor() {
        this.warningsCount = 0;
        this.errorsCount = 0;
    }

    log(...args) {
        console.log(...args);
    }

    logIf(condition, ...args) {
        if (condition) {
            this.log(...args);
        }
    }

    warn(...args) {
        this.warningsCount++;
        console.warn(...args);
    }

    error(...args) {
        this.errorsCount++;
        console.error(...args);
    }
}

const _logger = new _Logger();

_logger.log(`Easy front version: ${_easyFrontVersion}`);

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

function __executeHandler(id, event) {
    const handler = _globalFunctions.get(id);
    if (typeof handler !== 'function') {
        _logger.warn(`Trying execute deleted handler: ${id}`);

        return;
    }

    handler(event);
}

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

        return `__executeHandler('${id}',event)`;
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

/** @type {Set<string>} */
const _componentNamesSet = new Set();

class Subscriber {
    /**
     * @param {(value: any) => void} handler
     * @param {string} [componentName]
     */
    constructor(handler, componentName) {
        this.id = _getId(_subscriberIdPrefix);
        this.handler = handler;
        this.componentName = componentName;
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
            _logger.logIf(_easyFrontConfig.logging.executeHandlers, `[EXECUTING] ${subscriber.id} for ${subscriber.componentName}`);

            subscriber.handler(value);
        }
    }
}

class BaseModel {
    // TODO: typify it
    static _returnObservableFieldMode = 'value'; // 'value' | 'object'

    // TODO: typify it
    // TODO: can use only one array - _autoSubscribeComponents. _componentToObservableFields is useless
    static _componentToObservableFields = new Map();
    static _autoSubscribeComponents = [];

    static enableOnceReturnObject() {
        this._returnObservableFieldMode = 'object';
    }

    /**
     * @param {Component} component
     * @returns {void}
     */
    static startAutoSubscribe(component) {
        this._autoSubscribeComponents.push(component);
        this._componentToObservableFields.set(component, []);
    }

    /**
     * @returns {{ model: BaseModel; fieldName: string }[]}
     */
    static stopAutoSubscribe() {
        const component = this._autoSubscribeComponents.pop();
        const fields = this._componentToObservableFields.get(component) ?? [];

        const handled = new Set();
        const result = [];

        for (const field of fields) {
            const key = `${field.model.constructor.name}.${field.fieldName}(${field.model._id})`;

            if (!handled.has(key)) {
                handled.add(key);
                result.push(field);
            }
        }

        return result;
    }

    /**
     * @param {object} params
     * @param {BaseModel} params.model
     * @param {string} params.fieldName
     * @returns {void}
     */
    static _pushObservableFieldToAutoSubscribeComponent({ model, fieldName }) {
        if (!this._autoSubscribeComponents.length) {
            return;
        }

        const currentComponent = this._autoSubscribeComponents[this._autoSubscribeComponents.length - 1];

        const fields = this._componentToObservableFields.get(currentComponent);
        if (!fields) {
            return;
        }

        if (this._shouldPush()) {
            fields.push({ model, fieldName });
        }
    }

    // TODO: Refactor it. Is it good or bad solution (use Error.stack?
    /**
     * @returns {boolean}
     */
    static _shouldPush() {
        try {
            const [componentName, toHtmlMethod] = new Error()
                .stack
                .split(' at ')[4]
                .split(' ')[0]
                .split('.');

            if (toHtmlMethod !== 'toHtml') {
                return false;
            }

            return _componentNamesSet.has(componentName);
        } catch (error) {
            _logger.error(`Error on auto subscribe for model ${this.constructor.name}`);
        }
    }

    constructor() {
        this._id = _getId(_modelIdPrefix);
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
                BaseModel._pushObservableFieldToAutoSubscribeComponent({ model: self, fieldName });

                if (BaseModel._returnObservableFieldMode === 'object') {
                    BaseModel._returnObservableFieldMode = 'value';
                    return { model: self, fieldName };
                }

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

// Base class for components
class Component {
    /**
     * @param {object} [params]
     * @param {boolean} [params.autoSubscribe]
     * @returns {void}
     */
    constructor(params) {
        const { autoSubscribe = false } = params || {};

        this._autoSubscribeEnabled = autoSubscribe;
        this._id = _getId(_componentIdPrefix);
        this._idDestroyed = false;
        this._rendered = false;
        this._rendering = false;
        this._unsubscribeHandlers = [];

        _idToComponentMapping.set(this._id, this);
        _componentNamesSet.add(this.constructor.name);

        this._observableFields = [];
    }

    /**
     * @returns {string}
     */
    toHtml() {
        _logger.warn(`Should implement toHtml() for ${this.constructor.name}`);

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
        this._unsubscribeHandlers.forEach((handler) => handler());

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

        if (!this._rendered) {
            _logger.warn(`Trying redraw unrendered component: ${this.constructor.name}`);
            return true;
        }

        if (this._rendering) {
            _logger.warn(`Trying to redraw a component while rendering: ${this.constructor.name}`);
            return true;
        }

        this._rendering = true;

        try {
            const idsBefore = this._outerIds;
            this._element.outerHTML = this._toHtml();

            this._deleteUseless(idsBefore);

            return true;
        } catch (error) {
            _logger.error(`Error on redrawing (component: ${this.constructor.name}, id = ${this._id}): ${error.message}`, this);

            return false;
        } finally {
            this._rendering = false;
        }
    }

    /**
     * @param {string[]} idsBefore
     */
    _deleteUseless(idsBefore) {
        const idsAfter = new Set(this._outerIds);

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
                // TODO: useless log?
                // _logger.warn(`Component/handler (id = ${id}) not found for deleting in ${this.constructor.name}`);
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
        return document.querySelector(`[${_dataAttributeNames.componentId}="${this._id}"]`);
    }

    /**
     * @returns {string[]}
     */
    get _outerIds() {
        return this._getIdsFormElement(this._element.outerHTML);
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
     * @param {{ model: BaseModel; fieldName: string }[]} observableFields
     * @returns {void}
     */
    _autoSubscribe(observableFields) {
        for (const { model, fieldName } of observableFields) {
            const alreadySubscribed = this._observableFields.some((field) => field.fieldName === fieldName && field.model._id === model._id);

            if (!alreadySubscribed) {
                this._observableFields.push({ model, fieldName });

                this._subscribe({
                    model,
                    fieldName,
                    handler: () => this.redraw(),
                });
            }
        }
    }

    /**
     * @returns {string}
     */
    _toHtml() {
        _logger.logIf(_easyFrontConfig.logging.renderComponents, `[RENDER] ${this.constructor.name} ${this._id}`);

        this._rendered = true;

        BaseModel.startAutoSubscribe(this);
        const html = this.toHtml();
        const observableFields = BaseModel.stopAutoSubscribe();

        if (this._autoSubscribeEnabled) {
            _logger.logIf(_easyFrontConfig.logging.autoSubscribing, `[AUTO SUBSCRIBED] ${this.constructor.name} ${this._id}`);
            _logger.logIf(_easyFrontConfig.logging.autoSubscribing, observableFields);

            this._autoSubscribe(observableFields);
        }

        const nodes = new DOMParser()
            .parseFromString(html, "text/html")
            .body
            .childNodes;

        if (nodes.length < 1) {
            _logger.warn(`Nodes count in component ${this.constructor.name} should be more than 1`);

            return '';
        }

        const node = nodes[0];

        if (typeof node.setAttribute !== 'function') {
            _logger.error(`Component ${this.constructor.name} has incorrect html representation`);

            return '';
        }

        node.setAttribute(_dataAttributeNames.componentId, this._id);

        return node.outerHTML;
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

    /**
     * @returns {(field) => { onChange: (handler: Function) => void; redrawOnChange: () => void }}
     */
    get subscribe() {
        BaseModel.enableOnceReturnObject();

        return (field) => {
            const { model, fieldName } = field;

            return {
                onChange: (handler) => {
                    this._subscribe({
                        model,
                        fieldName,
                        handler,
                    });
                },
                redrawOnChange: () => {
                    this._subscribe({
                        model,
                        fieldName,
                        handler: () => this.redraw(),
                    });
                },
            };
        };
    }

    /**
     * @param {object} params
     * @param {BaseModel} params.model
     * @param {string} params.fieldName
     * @param {Function} params.handler
     * @returns {void}
     */
    _subscribe({ model, fieldName, handler }) {
        if (!(model instanceof BaseModel)) {
            _logger.error(`Error on subscribe for ${this.constructor.name} component: model is not a BaseModel`);

            return;
        }

        if (typeof handler !== 'function') {
            _logger.error(`Error on subscribe for ${this.constructor.name} component: handler is not a function`);

            return;
        }

        const subscriber = new Subscriber(handler, this.constructor.name);

        model.connect(fieldName, subscriber);

        this._unsubscribeHandlers.push(() => model.disconnect(fieldName, subscriber));
    }
}

class AutoSubscribeComponent extends Component {
    constructor() {
        super({ autoSubscribe: true });
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
