import { DataConnection } from 'peerjs';
import { Message } from './Message';
import { MessageManager } from './MessageManager';
/**
 * Super class of the client and server connection.
 *
 * Implements basic message sending and keep alive functionality.
 * The keep alive mechanism is active per default and continuously exchanges ping pong messages.
 * This ensures that the WebRTC connection stays active and measures the latency.
 *
 * Internally peerjs is used.
 */
export declare abstract class AbstractPeerConnection {
    /**
     * Internally used data channel for communication.
     */
    private _connection;
    /**
     * Every sent message gets a unique id.
     * For every sent message the id is incremented by one.
     * So this number matches the total amount of sent messages.
     */
    private _lastMessageId;
    private _manager;
    /**
     * To cope with the unstability of WebRTC empty message are sent
     * to prevent the data connection from "freezing".
     */
    private _sendKeepAliveMessage;
    private _keepAliveTimeout;
    private _keepAliveInterval;
    constructor();
    protected abstract onMessage(msg: Message): void;
    protected abstract onConnectionClose(): void;
    protected abstract onConnectionError(err: any): void;
    /**
     * Sends the given data load with the given type to a connected peer.
     * If the internal DataConnection is not open an error is thrown.
     *
     * @param type
     * @param data
     */
    sendMessage(type: string, data?: any): Message;
    private sendKeepAliveMessage;
    /**
     * Cancels the keep alive timeout and resets it to the interval.
     */
    private resetKeepAliveTimer;
    private clearTimeouts;
    private onConnectionDataCallback;
    private onConnectionCloseCallback;
    private onConnectionErrorCallback;
    /**
     * Sets the internally used DataConnection.
     */
    connection: DataConnection;
    readonly isConnected: boolean;
    readonly totalMessageCount: number;
    readonly manager: MessageManager;
}
