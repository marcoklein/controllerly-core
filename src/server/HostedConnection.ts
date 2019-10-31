import { AbstractPeerConnection, ConnectionState } from "../shared/AbstractPeerConnection";
import { MessageInterface } from "../shared/Message";
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
        if (connection.open) {
            console.log('Connection directly open!');
            // set the connection
            this.registerConnection(connection);
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

                // set the connection
                this.registerConnection(connection);
                this.gotToConnectedState();
            };
            let onErrorCallback = (err: any) => {
                removeListeners();
                console.error('Error during connection initiation: ', err);

                this.handleDisconnect();
            };
            connection.on('open', onOpenCallback);
            connection.on('error', onErrorCallback);
        }
    }

    protected gotToConnectedState() {
        // mark as connected
        this.changeState(ConnectionState.CONNECTED);

        // add to connected clients list in server
    }

    disconnect() {
        throw new Error('Function not implemented yet.');
    }

    protected handleDisconnect() {
        this.changeState(ConnectionState.DISCONNECTED);
    }


    protected onMessageCallback(msg: MessageInterface): void {
    }
    
    protected onConnectionCloseCallback(): void {
        this.handleDisconnect();
    }

    protected onConnectionErrorCallback(err: any): void {
        this.handleDisconnect();
    }

    /* Getter and Setter */

    get server(): ControllerlyServer {
        return this._server.realInstance;
    }


}