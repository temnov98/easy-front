/**
 * @template T
 * @param {T[]} array
 * @param {number} from
 * @param {number} to
 * @return {T[]}
 */
function moveArrayItem({ array, from, to }) {
    const item = array[from];

    const result = array.filter((i, index) => index !== from);

    result.splice(to, 0, item);

    return result;
}
