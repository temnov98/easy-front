let _startValue = 1;

/**
 * @returns {string}
 */
function getId() {
    return `${_startValue++}:${Math.random().toString()}`;
}
