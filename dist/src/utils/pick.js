"use strict";
/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.pick = void 0;
const pick = (object, keys, searchField = 'search') => {
    return keys
        .concat(searchField)
        .reduce((obj, key) => {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
            if (searchField === key) {
                obj.$text = { $search: object[key] };
            }
            else {
                obj[key] = object[key];
            }
        }
        return obj;
    }, {});
};
exports.pick = pick;
