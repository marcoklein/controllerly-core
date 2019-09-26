

import { DataConnection } from 'peerjs';
import { Message, MessageData } from './Message';
import { MessageManager } from './MessageManager';
import { TypedEvent } from './TypedEvent';

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
    private _connection: DataConnection | undefined;


    /* Message Tracking */

    /**
     * Every sent message gets a unique id.
     * For every sent message the id is incremented by one.
     * So this number matches the total amount of sent messages.
     */
    private _lastMessageId: number = 0;
    
    protected _manager: MessageManager | undefined;

    readonly onMessage: TypedEvent<MessageData> = new TypedEvent<MessageData>();


    /* Keep Alive */

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
    
    protected abstract onMessageCallback(msg: MessageData): void;

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
        if (this._connection === undefined || !this.isConnected) {
            throw new Error('Send Message Error: DataConnection is closed.');
        }
        if (this._manager === undefined) {
            throw new Error('Send Message Error: MessageManager is null.');
        }

        // create next message id
        this._lastMessageId++;

        // create a new message
        let message = new Message(this._lastMessageId, type, data);

        // store message
        this._manager.put(message);

        // send message data
        this._connection.send(message.toData());

        // reset keep alive timer because we are already sending a message
        this.resetKeepAliveTimer();

        return message;
    }

    
    /**
     * Disconnectes completely from the server, without the chance of reconnecting.
     */
    disconnect() {
        //this.sendMessage('DISCONNECT');
        // message is not sent when calling connection.close() immediately.
        // => return Promise()?
        // without a disconnect message, the WebRTC connection remains open for ~10s before it closes
        // => maybe the keep alive functionality fixes this/gets faster feedback, that the connection is closed
        // however, then the server does not know if the client wants to reconnect
        this.connection.close();
    }

    /* Keep Alive */

    private sendKeepAliveMessage() {
        this.sendMessage('PING');
    }

    /**
     * Cancels the keep alive timeout and resets it to the interval.
     */
    private resetKeepAliveTimer() {
        if (!this._sendKeepAliveMessage) {
            return;
        }
        clearTimeout(this._keepAliveTimeout);
        this._keepAliveTimeout = setTimeout(() => {
            this.sendKeepAliveMessage();
        }, this._keepAliveInterval);
    }
    
    private clearTimeouts() {
        clearTimeout(this._keepAliveTimeout);
    }

    
    /* Callbacks */

    private onConnectionDataCallback = (msg: Message | any) => {
        if (this._manager === undefined || this._connection === undefined) {
            return;
        }
        if (msg.ack) {
            // received acknowledge message
            this._manager.acknowledge(msg.ack);
        } else if (msg.type) {
            // send ACK for received message
            this._connection.send({ack: msg.id});

            // handle internal keep alive messages
            if (msg.type === 'PING') {
                // do nothing
            } else if (msg.type === 'DISCONNECT') {
                this.connection.close();
            } else {
                // inform listener
                this.onMessage.emit(msg);
                this.onMessageCallback(msg);
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
     * 
     * All listeners are updated accordingly.
     */
    protected setConnection(connection: DataConnection | undefined) {
        if (this._connection) {
            // remove event listeners from old connection
            this._connection.off('data', this.onConnectionDataCallback);
            this._connection.off('close', this.onConnectionCloseCallback);
            this._connection.off('error', this.onConnectionErrorCallback);
            // stop keep alive
            this.clearTimeouts();
            // stop the manager
            if (this._manager) this._manager.destroy();
            this._manager = undefined;
        }
        this._connection = connection;
        if (this._connection) {
            // add listeners to new connection
            this._connection.on('data', this.onConnectionDataCallback);
            this._connection.on('close', this.onConnectionCloseCallback);
            this._connection.on('error', this.onConnectionErrorCallback);
            this._manager = new MessageManager();
        }
    }

    get connection(): DataConnection | undefined {
        return this._connection;
    }

    get isConnected(): boolean {
        return this._connection !== undefined && this._connection.open;
    }

    get totalMessageCount(): number {
        return this._lastMessageId;
    }

    get manager(): MessageManager | undefined {
        return this._manager;
    }

}