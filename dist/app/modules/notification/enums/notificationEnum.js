"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = exports.Medium = void 0;
var Medium;
(function (Medium) {
    Medium["EMAIL"] = "EMAIL";
    Medium["SMS"] = "SMS";
    Medium["PUSH_NOTIFICATION"] = "PUSH_NOTIFICATION";
})(Medium || (exports.Medium = Medium = {}));
var Status;
(function (Status) {
    Status["IN_PROGRESS"] = "IN_PROGRESS";
    Status["SENT"] = "SENT";
    Status["FAILED"] = "FAILED";
})(Status || (exports.Status = Status = {}));
