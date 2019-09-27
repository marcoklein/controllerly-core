import { AbstractPeerConnection, ConnectionState } from "./AbstractPeerConnection";
import { MessageData } from "./Message";
import Peer from "peerjs";
import { openPeerWithId, connectToPeerWithId } from "./Utils";


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
        if (this.state !== ConnectionState.DISCONNECTED) {
            console.warn('Called connect but ControllerlyClient is already connecting or connected.');
            return this._connectionPromise;
        }
        this.changeState(ConnectionState.CONNECTING);
        return this._connectionPromise = new Promise((resolve, reject) => {
            openPeerWithId().then((peer: Peer) => {
                // success
                this.peer = peer;

                // listen for new data connection
                connectToPeerWithId(peer, connectionCode).then(connection => {
                    // peer open and connected!
                    // TODO exchange initial connection details
                    this.registerConnection(connection);
                    this.changeState(ConnectionState.CONNECTED);
                    resolve(this);
                }).catch(e => {
                    this.peer.destroy();
                    this.peer = null;
                    this.changeState(ConnectionState.DISCONNECTED);
                    reject(e);
                });

            }).catch(e => {
                // no success with connection
                this.changeState(ConnectionState.DISCONNECTED);
                reject(e);
            });
        });
    }

    /* Add methods to send button/axis updates */

    protected onMessageCallback(msg: MessageData): void {
    }
    
    protected onConnectionCloseCallback(): void {
        this.changeState(ConnectionState.DISCONNECTED);
    }
    protected onConnectionErrorCallback(err: any): void {
        this.changeState(ConnectionState.DISCONNECTED);
    }




    /* Getter and Setter */


}