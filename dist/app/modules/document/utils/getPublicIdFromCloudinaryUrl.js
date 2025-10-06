"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicIdFromUrl = void 0;
const getPublicIdFromUrl = (url) => {
    const match = url.match(/upload\/(?:v\d+\/)?([^\.]+)/);
    return match ? match[1] : null;
};
exports.getPublicIdFromUrl = getPublicIdFromUrl;
