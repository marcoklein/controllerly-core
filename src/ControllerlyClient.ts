import { AbstractPeerConnection } from "./AbstractPeerConnection";
import { Message, MessageData } from "./Message";
import Peer = require("peerjs");
import { TypedEvent } from "./TypedEvent";
import { ConnectionState } from "./HostedConnection";
import { CONNECTION_PROPS } from "./globals";
import { openPeerWithId, connectToPeerWithId } from "./Utils";

export enum ClientState {
    CONNECTING,
    CONNECTED,
    RECONNECTING,
    DISCONNECTED
}

export class ControllerlyClient extends AbstractPeerConnection {

    /**
     * Unique id from the server. Used to identify a client of a server.
     * Provided when reconnecting.
     */
    protected id: string;

    /**
     * Client-side peer.
     */
    private peer: Peer;
    private _connectionPromise: Promise<ControllerlyClient>;

    private _state: ClientState = ClientState.DISCONNECTED;

    readonly onStateListener: TypedEvent<ConnectionState> = new TypedEvent<ConnectionState>();
    
    constructor() {
        super();
    }


    connect(connectionCode: string): Promise<ControllerlyClient> {
        // test if already connecting
        // only connect if currently disconnected!
        if (this._state !== ClientState.DISCONNECTED) {
            console.warn('Called connect but ControllerlyClient is already connecting or connected.');
            return this._connectionPromise;
        }
        this._state = ClientState.CONNECTING;
        return this._connectionPromise = new Promise((resolve, reject) => {
            openPeerWithId().then((peer: Peer) => {
                // success
                this.peer = peer;

                // listen for new data connection
                connectToPeerWithId(peer, connectionCode).then(connection => {
                    // peer open and connected!
                    // TODO exchange initial connection details
                    this.setConnection(connection)
                    this._state = ClientState.CONNECTED;
                    this.initNewConnection();
                    resolve(this);
                }).catch(e => {
                    this.peer.destroy();
                    this.peer = null;
                    reject(e);
                });

            }).catch(e => {
                // no success with connection
                reject(e);
            });
        });
    }

    private initNewConnection() {


    }


    
    protected onMessage(msg: MessageData): void {
    }
    
    protected onConnectionClose(): void {

    }
    protected onConnectionError(err: any): void {

    }
}