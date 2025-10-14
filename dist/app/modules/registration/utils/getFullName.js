"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullName = void 0;
const getFullName = (firstName, lastName) => {
    const fullName = `${firstName} ${lastName}`;
    return fullName.trim();
};
exports.getFullName = getFullName;
