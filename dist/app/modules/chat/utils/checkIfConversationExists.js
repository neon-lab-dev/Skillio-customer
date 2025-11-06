"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasSameId = void 0;
const hasSameId = (arr1, arr2) => {
    for (const id of arr1) {
        if (arr2.includes(id)) {
            return { flag: true, id };
        }
    }
    return { flag: false, id: '' };
};
exports.hasSameId = hasSameId;
