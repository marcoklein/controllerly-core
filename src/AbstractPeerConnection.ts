

import { DataConnection } from 'peerjs';

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


    sendMessage(type: string, data?: any): number {
        if (!this.isConnected) {
            throw new Error('Send Message Error: DataConnection is closed.');
        }

        // create next message id
        this._lastMessageId++;

        return this._lastMessageId;
    }

    /* Getter and Setter */

    get isConnected(): boolean {
        return this._connection && this._connection.open;
    }

    get totalMessageCount(): number {
        return this._lastMessageId;
    }

}