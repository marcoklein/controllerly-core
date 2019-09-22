"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MessageManager = /** @class */ (function () {
    function MessageManager() {
        this.messageTimeout = 1000;
        this._pendingCount = 0;
        this._pendingMessages = {};
    }
    /**
     * Stores the given message and waits for the ACK message.
     *
     * @param message
     */
    MessageManager.prototype.put = function (message) {
        this._pendingMessages[message.id] = message;
        this._pendingCount++;
        message.timestamp = Date.now();
        this.startPendingTimer();
    };
    MessageManager.prototype.startPendingTimer = function () {
        var _this = this;
        if (this._pendingCount > 0 && !this.messageTimer) {
            // start message timer
            this.messageTimer = setTimeout(function () {
                _this.messageTimer = undefined;
                _this.updatePending();
                _this.startPendingTimer();
            }, this.messageTimeout);
        }
    };
    MessageManager.prototype.acknowledge = function (messageId) {
        var message = this._pendingMessages[messageId];
        if (!message) {
            console.info('Received ACK message for Message that already timed out.');
            return;
        }
        message.acknowledged = Date.now();
        message.timeout = false;
        this.removeFromPending(message);
    };
    /**
     * Mark message as timed out.
     *
     * @param messageId
     */
    MessageManager.prototype.timeout = function (msg) {
        msg.acknowledged = undefined;
        msg.timeout = true;
        this.removeFromPending(msg);
    };
    MessageManager.prototype.removeFromPending = function (message) {
        // remove from pending
        delete this._pendingMessages[message.id];
        this._pendingCount--;
    };
    /**
     * Update list of pending messages and remove messages that timed out.
     */
    MessageManager.prototype.updatePending = function () {
        // loop through all pending messages and check which timed out
        var now = Date.now();
        for (var msgId in this._pendingMessages) {
            var msg = this._pendingMessages[msgId];
            if (msg.timestamp + this.messageTimeout < now) {
                // timeout
                this.timeout(msg);
            }
        }
    };
    /**
     * Stop updating the manager.
     */
    MessageManager.prototype.destroy = function () {
        if (this.messageTimer) {
            clearTimeout(this.messageTimer);
        }
    };
    Object.defineProperty(MessageManager.prototype, "pendingCount", {
        /* Getter and Setter */
        get: function () {
            return this._pendingCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageManager.prototype, "pendingMessages", {
        get: function () {
            return this._pendingMessages;
        },
        enumerable: true,
        configurable: true
    });
    return MessageManager;
}());
exports.MessageManager = MessageManager;
