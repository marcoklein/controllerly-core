"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Message_1 = require("./Message");
var MessageManager_1 = require("./MessageManager");
/**
 * Super class of the client and server connection.
 *
 * Implements basic message sending and keep alive functionality.
 * The keep alive mechanism is active per default and continuously exchanges ping pong messages.
 * This ensures that the WebRTC connection stays active and measures the latency.
 *
 * Internally peerjs is used.
 */
var AbstractPeerConnection = /** @class */ (function () {
    function AbstractPeerConnection() {
        var _this = this;
        /* Message Tracking */
        /**
         * Every sent message gets a unique id.
         * For every sent message the id is incremented by one.
         * So this number matches the total amount of sent messages.
         */
        this._lastMessageId = 0;
        /* Keep Alive */
        /**
         * To cope with the unstability of WebRTC empty message are sent
         * to prevent the data connection from "freezing".
         */
        this._sendKeepAliveMessage = true;
        this._keepAliveInterval = 80;
        /* Callbacks */
        this.onConnectionDataCallback = function (msg) {
            if (msg.ack) {
                // received acknowledge message
                _this._manager.acknowledge(msg.ack);
            }
            else if (msg.type) {
                // send ACK for received message
                _this._connection.send({ ack: msg.id });
                // handle internal keep alive messages
                if (msg.type === 'PING') {
                    // do nothing
                }
                else {
                    // inform listener
                    _this.onMessage(msg);
                }
            }
            else {
                console.warn('Messages with no type can not be processed.');
            }
        };
        this.onConnectionCloseCallback = function () {
            _this.clearTimeouts();
            _this.onConnectionClose();
        };
        this.onConnectionErrorCallback = function (err) {
            _this.clearTimeouts();
            _this.onConnectionError(err);
        };
    }
    /* Message methods */
    /**
     * Sends the given data load with the given type to a connected peer.
     * If the internal DataConnection is not open an error is thrown.
     *
     * @param type
     * @param data
     */
    AbstractPeerConnection.prototype.sendMessage = function (type, data) {
        if (!this.isConnected) {
            throw new Error('Send Message Error: DataConnection is closed.');
        }
        // create next message id
        this._lastMessageId++;
        // create a new message
        var message = new Message_1.Message(this._lastMessageId, type, data);
        // store message
        this._manager.put(message);
        // send message data
        this._connection.send(message.toData());
        // reset keep alive timer because we are already sending a message
        this.resetKeepAliveTimer();
        return message;
    };
    /* Keep Alive */
    AbstractPeerConnection.prototype.sendKeepAliveMessage = function () {
        this.sendMessage('PING');
    };
    /**
     * Cancels the keep alive timeout and resets it to the interval.
     */
    AbstractPeerConnection.prototype.resetKeepAliveTimer = function () {
        var _this = this;
        if (!this._sendKeepAliveMessage) {
            return;
        }
        clearTimeout(this._keepAliveTimeout);
        this._keepAliveTimeout = setTimeout(function () {
            _this.sendKeepAliveMessage();
        }, this._keepAliveInterval);
    };
    AbstractPeerConnection.prototype.clearTimeouts = function () {
        clearTimeout(this._keepAliveTimeout);
    };
    Object.defineProperty(AbstractPeerConnection.prototype, "connection", {
        get: function () {
            return this._connection;
        },
        /* Getter and Setter */
        /**
         * Sets the internally used DataConnection.
         */
        set: function (connection) {
            if (this._connection) {
                // remove event listeners from old connection
                this.connection.off('data', this.onConnectionDataCallback);
                this.connection.off('close', this.onConnectionCloseCallback);
                this.connection.off('error', this.onConnectionErrorCallback);
                // stop keep alive
                this.clearTimeouts();
                // stop the manager
                this._manager.destroy();
                this._manager = undefined;
            }
            this._connection = connection;
            if (connection) {
                // add listeners to new connection
                this.connection.on('data', this.onConnectionDataCallback);
                this.connection.on('close', this.onConnectionCloseCallback);
                this.connection.on('error', this.onConnectionErrorCallback);
                this._manager = new MessageManager_1.MessageManager();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractPeerConnection.prototype, "isConnected", {
        get: function () {
            return this._connection !== undefined && this._connection.open;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractPeerConnection.prototype, "totalMessageCount", {
        get: function () {
            return this._lastMessageId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractPeerConnection.prototype, "manager", {
        get: function () {
            return this._manager;
        },
        enumerable: true,
        configurable: true
    });
    return AbstractPeerConnection;
}());
exports.AbstractPeerConnection = AbstractPeerConnection;
