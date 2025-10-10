"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentDTO = void 0;
class DocumentDTO {
    constructor(data) {
        this.remarks = data.remarks;
        this.type = data.type;
    }
    toJSON() {
        return {
            remarks: this.remarks,
            type: this.type,
            portfolioId: this.portfolioId
        };
    }
}
exports.DocumentDTO = DocumentDTO;
