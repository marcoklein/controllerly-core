import { AbstractPeerConnection, ConnectionState } from "./AbstractPeerConnection";
import { Message, MessageData } from "./Message";
import { TypedEvent } from "./TypedEvent";
import { ControllerlyServer, ControllerlyServerDecorator } from "./ControllerlyServer";
import { DataConnection } from "peerjs";



/**
 * Server-side representation of a ControllerlyClient connection.
 * 
 * A HostedConnection handles connection, disconnection, and reconnection logic.
 * It has three states: CONNECTING, CONNECTED, DISCONNECTED.
 * 
 */
export class HostedConnection extends AbstractPeerConnection {
    
    private _server: ControllerlyServerDecorator;

    constructor(server: ControllerlyServer, connection: DataConnection) {
        super();
        this._server = new ControllerlyServerDecorator(server);
        this.handleInitialConnection(connection);
    }

    /**
     * Handles the initial connection.
     * 
     * @param connection 
     */
    private handleInitialConnection(connection: DataConnection) {
        // set the connection
        this.setConnection(connection);

        if (connection.open) {
            console.log('Connection directly open!');
            this.gotToConnectedState();
        } else {
            const server = this._server.realInstance;
            // wait for opening...
            let removeListeners = () => {
                connection.off('open', onOpenCallback);
                connection.off('error', onErrorCallback);
            }
            let onOpenCallback = () => {
                removeListeners();

                this.gotToConnectedState();
            };
            let onErrorCallback = (err: any) => {
                removeListeners();
                console.error('Error during connection initiation: ', err);

                this.handleDisconnect();
            };
            connection.on('open', onOpenCallback);
            connection.on('error', onOpenCallback);
        }
    }

    gotToConnectedState() {
        // mark as connected
        this._state = ConnectionState.CONNECTED;

        // add to connected clients list in server
    }

    handleDisconnect() {
        this._state = ConnectionState.DISCONNECTED;
        // remove hosted connection from server

    }


    protected onMessage(msg: MessageData): void {
    }
    
    protected onConnectionClose(): void {
        this.handleDisconnect();
    }

    protected onConnectionError(err: any): void {
        this.handleDisconnect();
    }

    /* Getter and Setter */

    get server(): ControllerlyServer {
        return this._server.realInstance;
    }

}