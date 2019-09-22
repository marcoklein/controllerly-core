

import { DataConnection } from 'peerjs';
import { Message } from './Message';

/**
 * Super class of the client and server connection.
 * 
 * Implements basic message sending and keep alive functionality.
 * The keep alive mechanism is active per default and continuously exchanges ping pong messages.
 * This ensures that the WebRTC connection stays active and measures the latency.
 * 
 * Internally peerjs is used.
 */
export abstract class AbstractPeerConnection {

    /**
     * Internally used data channel for communication.
     */
    private _connection: DataConnection;


    /* Message Tracking */

    /**
     * Every sent message gets a unique id.
     * For every sent message the id is incremented by one.
     * So this number matches the total amount of sent messages.
     */
    private _lastMessageId: number = 0;
    //private messageMap: CacheArray

    /**
     * To cope with the unstability of WebRTC empty message are sent
     * to prevent the data connection from "freezing".
     */
    private _sendKeepAliveMessage: boolean = true;
    private _keepAliveTimeout: any;
    private _keepAliveInterval: number = 80;

    constructor() {
    }

    
    /* Abstract methods */
    
    protected abstract onMessage(msg: Message): void;

    protected abstract onConnectionClose(): void;

    protected abstract onConnectionError(err: any): void;

    /* Message methods */

    /**
     * Sends the given data load with the given type to a connected peer.
     * If the internal DataConnection is not open an error is thrown.
     * 
     * @param type 
     * @param data 
     */
    sendMessage(type: string, data?: any): Message {
        if (!this.isConnected) {
            throw new Error('Send Message Error: DataConnection is closed.');
        }

        // create next message id
        this._lastMessageId++;

        // create a new message
        let message = new Message(this._lastMessageId, type, data);
        message.timestamp = Date.now();

        // send message data
        this._connection.send(message.toData());

        // reset keep alive timer because we are already sending a message
        this.resetKeepAliveTimer();

        return message;
    }

    /* Keep Alive */

    private sendKeepAliveMessage() {
        this.sendMessage('PING');
    }

    /**
     * Cancels the keep alive timeout and resets it to the interval.
     */
    private resetKeepAliveTimer() {
        clearTimeout(this._keepAliveTimeout);
        this._keepAliveTimeout = setTimeout(() => {
            this.sendKeepAliveMessage();
        }, this._keepAliveInterval);
    }
    
    private clearTimeouts() {
        clearTimeout(this._keepAliveTimeout);
    }

    
    /* Callbacks */

    private onConnectionDataCallback = (msg: Message) => {
        if (msg.type) {
            // acknowledge incoming message
            this.sendMessage('ACK', msg.id);

            // handle internal keep alive messages
            if (msg.type === 'PING') {
                // do nothing
            } else if (msg.type === 'ACK') {
                // TODO mark message as acknowledged
            } else {
                // inform listener
                this.onMessage(msg);
            }

        } else {
            console.warn('Messages with no type can not be processed.');
        }
    }

    private onConnectionCloseCallback = () => {
        this.clearTimeouts();
        this.onConnectionClose();
    }

    private onConnectionErrorCallback = (err: any) => {
        this.clearTimeouts();
        this.onConnectionError(err);
    }


    /* Getter and Setter */
    
    /**
     * Sets the internally used DataConnection.
     */
    set connection(connection: DataConnection) {
        if (this._connection) {
            // remove event listeners from old connection
            this.connection.off('data', this.onConnectionDataCallback);
            this.connection.off('close', this.onConnectionCloseCallback);
            this.connection.off('error', this.onConnectionErrorCallback);
        }
        this._connection = connection;
        if (connection) {
            // add listeners to new connection
            this.connection.on('data', this.onConnectionDataCallback);
            this.connection.on('close', this.onConnectionCloseCallback);
            this.connection.on('error', this.onConnectionErrorCallback);
        }
    }

    get connection(): DataConnection {
        return this._connection;
    }

    get isConnected(): boolean {
        return this._connection !== undefined && this._connection.open;
    }

    get totalMessageCount(): number {
        return this._lastMessageId;
    }

}