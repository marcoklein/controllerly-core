import { AbstractPeerConnection } from "./AbstractPeerConnection";
import { MessageData } from "./Message";
import Peer from "peerjs";
import { TypedEvent } from "./TypedEvent";
import { openPeerWithId, connectToPeerWithId } from "./Utils";

export enum ClientState {
    CONNECTING,
    CONNECTED,
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

    readonly onStateChange: TypedEvent<ClientState> = new TypedEvent<ClientState>();
    
    constructor() {
        super();
    }


    /**
     * Connects to a ControllerlyServer Peer with the given connection code.
     * The connection code is provided by the server.
     * 
     * The promise returns a connection Promise and resolves if the connection is fully established.
     * 
     * @param connectionCode 
     */
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
                    this.registerConnection(connection)
                    this._state = ClientState.CONNECTED;
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

    protected notifyOnStateChange() {
        this.onStateChange.emit(this._state);
    }

    /* Add methods to send button/axis updates */

    
    protected onMessageCallback(msg: MessageData): void {
    }
    
    protected onConnectionCloseCallback(): void {
        this._state = ClientState.DISCONNECTED;
    }
    protected onConnectionErrorCallback(err: any): void {
        this._state = ClientState.DISCONNECTED;
    }




    /* Getter and Setter */

    get state(): ClientState {
        return this._state;
    }
}