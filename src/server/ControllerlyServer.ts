import Peer, { DataConnection } from "peerjs";
import { HostedConnection } from "./HostedConnection";
import { TypedEvent, Listener } from "../TypedEvent";
import { openPeerWithId, removeElementFromArray } from "../Utils";
import { ConnectionState } from "../shared/AbstractPeerConnection";

export enum ServerState {
    STOPPED,
    STARTING,
    RUNNING
}



/**
 * The ControllerlyServer has multiple HostedConnections that represent client connections.
 */
export class ControllerlyServer {

    private _state: ServerState = ServerState.STOPPED;

    /**
     * Server-side WebRTC peer.
     */
    private _peer: Peer;

    /**
     * List of all connected clients.
     */
    clients: HostedConnection[] = [];
    /**
     * List of clients that are currently connecting.
     */
    private _connectingClients: HostedConnection[] = [];
    /**
     * List of clients that could reconnect.
     */
    clientsThatCouldReconnect: HostedConnection[] = [];

    /* Connection Code */

    /**
     * Connection code for client this server has.
     * Is set during start().
     */
    private _connectionCode: string;

    /**
     * Characters that the code generation algorithm uses to build a random connection code.
     * Per default, this is the character set of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.
     */
    codeCharacters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    /**
     * Length of a randomly generated connection code.
     * 5 per default.
     */
    connectionCodeLength: number = 5;

    /* Events */

    readonly onStateChange: TypedEvent<ServerState> = new TypedEvent<ServerState>();
    readonly onClientConnected: TypedEvent<HostedConnection> = new TypedEvent<HostedConnection>();
    readonly onClientDisconnected: TypedEvent<HostedConnection> = new TypedEvent<HostedConnection>();
    readonly onClientReconnected: TypedEvent<HostedConnection> = new TypedEvent<HostedConnection>();
    
    /* Properties */
    rememberConnectionCode: boolean = true;

    constructor() {
    }

    private reset() {
        this._state = ServerState.STOPPED;
        this.notifyOnStateChange();
        this._peer = null;
        this.clients = [];
        this.clientsThatCouldReconnect = [];
    }

    start(preferredConnectionCode?: string, numberOfRetries: number = 10): Promise<string> {
        if (this._state === ServerState.STARTING) {
            throw new Error('Server Start Error: Server is already in starting state.');
        }
        // reset variables
        this.reset();

        this._state = ServerState.STARTING;
        this.notifyOnStateChange();
        
        // get code
        let code = preferredConnectionCode || this.generateRandomConnectionCode();

        return new Promise((resolve, reject) => {

            let numberOfTries = 0;

            let establishConnection = async () => {
                // use the preferred connection code for the first try - but then generate a random one!
                code = numberOfTries === 0 ? code : this.generateRandomConnectionCode();
                try {
                    this._peer = await openPeerWithId(code);

                    this._state = ServerState.RUNNING;
                    this.notifyOnStateChange();
                    this._connectionCode = code;

                    this.initNewServerPeer();

                    resolve(code);
                    
                    if (this.rememberConnectionCode) {
                        // TODO store connection code on successfull connection
                        //window.localStorage.setItem('connectionCode', connectionCode);
                    }
                } catch (e) {
                    // next try
                    numberOfTries++;
                    if (numberOfTries >= numberOfRetries) {
                        // return with an error
                        this._state = ServerState.STOPPED;
                        this.notifyOnStateChange();
                        if (this._peer) this._peer.destroy();
                        this._peer = null;
                        reject(e);
                    } else {
                        establishConnection();
                    }
                }
            }
            establishConnection();
        });


    }

    
    /**
     * Helper to generate a random connection code.
     */
    private generateRandomConnectionCode(): string {
        let result = '';
        for (let i = 0; i < this.connectionCodeLength; i++) {
            result += this.codeCharacters.charAt(Math.floor(Math.random() * this.codeCharacters.length));
        }
        return result;
    }


    private initNewServerPeer() {
        this.peer.on('connection', this.onPeerConnection);
        // TODO listen to peer errors...
    }

    private notifyOnStateChange() {
        this.onStateChange.emit(this._state);
    }

    /**
     * Remove all listeners.
     */
    resetListeners() {
        // reset events
        this.onClientConnected.removeAll();
        this.onClientDisconnected.removeAll();
        this.onClientReconnected.removeAll();
    }
    

    /* Callbacks */

    /**
     * Callback as a new peer connects.
     * Creates a new HostedConnection for the client.
     */
    private onPeerConnection = (connection: DataConnection) => {
        // the HostedConnection handles opening, closing, and reconnections
        let hostedConnection = new HostedConnection(this, connection);
        this._connectingClients.push(hostedConnection);

        let stateListener: Listener<ConnectionState> = (state) => {
            if (state === ConnectionState.CONNECTED) {
                // switch to connected
                // remove from connecting list
                removeElementFromArray(this._connectingClients, hostedConnection);
                // add to connected list
                this.clients.push(hostedConnection);

                this.onClientConnected.emit(hostedConnection);
            } else if (state === ConnectionState.DISCONNECTED) {
                // remove from server and destroy hosted connection
                // remove from connected or connecting list
                removeElementFromArray(this._connectingClients, hostedConnection);
                removeElementFromArray(this.clients, hostedConnection);

                // remove
                this.onClientDisconnected.emit(hostedConnection);
            }
        };

        // listen for state changes
        hostedConnection.onStateChange.on(stateListener);
    };

    /* Getter and Setter */

    get connectionCode(): string {
        return this._connectionCode;
    }

    get peer(): Peer {
        return this._peer;
    }

    get connectingClients(): HostedConnection[] {
        return this._connectingClients;
    }

    get state(): ServerState {
        return this._state;
    }

}


/**
 * Helper methods to give HostedConnection direct access to the ControllerlyServer.
 */
export class ControllerlyServerDecorator extends ControllerlyServer {
    realInstance: ControllerlyServer;

    constructor(server: ControllerlyServer) {
        super();
        this.realInstance = server;
    }

    hostedConnectionConnected() {

    }

    hostedConnectionDisconnected() {

    }
    
}