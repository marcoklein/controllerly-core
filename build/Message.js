"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Message = /** @class */ (function () {
    function Message(id, type, data) {
        this.id = id;
        this.type = type;
        this.data = data;
    }
    Message.prototype.toData = function () {
        return {
            id: this.id,
            type: this.type,
            data: this.data
        };
    };
    Object.defineProperty(Message.prototype, "latency", {
        /**
         * Travel time of message - difference of timestamp and acknowledged.
         */
        get: function () {
            return this.timestamp !== undefined && this.acknowledged !== undefined ? this.acknowledged - this.timestamp : null;
        },
        enumerable: true,
        configurable: true
    });
    return Message;
}());
exports.Message = Message;
