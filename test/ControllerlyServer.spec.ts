import { expect } from 'chai';
import 'mocha';
import { delay } from './TestUtils';
import Peer, { DataConnection } from "peerjs";

import { ControllerlyServer, ServerState } from '../src/ControllerlyServer';


const TEST_ID = 'testId';


describe('ControllerlyServer test', () => {

    let server: ControllerlyServerMock;

    before(() => {
        server = new ControllerlyServerMock();
        
    });

    describe('#start()', () => {
        it('should be stopped', () => {
            expect(server.state).to.equal(ServerState.STOPPED);
            expect(server.peer).to.be.undefined;
        })
        it('should connect with test id', done => {
            server.start(TEST_ID).then((id: string) => {
                expect(id).to.equal(TEST_ID);
                expect(server.connectionCode).to.equal(TEST_ID);
                expect(server.peer).not.to.be.undefined;
                done();
            });
        });
        it('should be running', () => {
            expect(server.state).to.equal(ServerState.RUNNING);
        });
    });

    describe('#on connection', () => {
        let clientConn: ClientConnectionMock;
        before(() => {
            clientConn = new ClientConnectionMock();
            // a new connection creates a new HostedConnection
            server.peerMock.simulateEmit('connection', clientConn);
        });
        it('should add the new connection', () => {
            expect(server.connectingClients.length).to.equal(1);
            expect(server.connectingClients[0].connection).to.equal(clientConn);
        });
        it('should be added to the clients list', () => {
            //clientConn.open = true;
            //(<any> clientConn).emit('open');

        })
    });

    
});

/* Mock classes */

class ControllerlyServerMock extends ControllerlyServer {

    get peerMock(): ServerPeerMock {
        return <ServerPeerMock> this.peer;
    }

    createNewWebRTCPeer(id: string, options: Peer.PeerJSOption): Peer {
        options = options ? options : {};
        // use test options for Peer connection
        (<any> options).token = 'testToken';
        options.host = 'localhost';
        options.port = 8080;

        let peer = new ServerPeerMock(id, options);
        return peer;
    }
}

/**
 * Simulates client-side data connection.
 */
class ClientConnectionMock implements DataConnection {
    send(data: any): void {
        throw new Error("Method not implemented.");
    }    close(): void {
        throw new Error("Method not implemented.");
    }
    on(event: string, cb: () => void): void;
    on(event: "data", cb: (data: any) => void): void;
    on(event: "open", cb: () => void): void;
    on(event: "close", cb: () => void): void;
    on(event: "error", cb: (err: any) => void): void;
    on(event: any, cb: any) {
    }
    off(event: string, fn: Function, once?: boolean): void {
    }
    dataChannel: RTCDataChannel;
    label: string;
    metadata: any;
    open: boolean;
    peerConnection: RTCPeerConnection;
    peer: string;
    reliable: boolean;
    serialization: string;
    type: string;
    bufferSize: number;
}

class DataConnectionMock implements DataConnection {
    send(data: any): void {
        throw new Error("Method not implemented.");
    }    close(): void {
        throw new Error("Method not implemented.");
    }
    on(event: string, cb: () => void): void;
    on(event: "data", cb: (data: any) => void): void;
    on(event: "open", cb: () => void): void;
    on(event: "close", cb: () => void): void;
    on(event: "error", cb: (err: any) => void): void;
    on(event: any, cb: any) {
        throw new Error("Method not implemented.");
    }
    off(event: string, fn: Function, once?: boolean): void {
        throw new Error("Method not implemented.");
    }
    dataChannel: RTCDataChannel;
    label: string;
    metadata: any;
    open: boolean;
    peerConnection: RTCPeerConnection;
    peer: string;
    reliable: boolean;
    serialization: string;
    type: string;
    bufferSize: number;
}

class ServerPeerMock extends Peer {
    constructor(id: string, options: Peer.PeerJSOption) {
        super(id, options);
        // we simulate the connection...
        this.disconnect();
        
        setTimeout(() => {
            this.simulateEmit('open', new DataConnectionMock());
        }, 100);
    }

    /**
     * emit() is not exposed by PeerJs. However, Peer extends EventEmitter, so we hijack the function.
     * 
     * @param type 
     * @param data 
     */
    simulateEmit(type: string, data: any) {
        (<any> this).emit(type, data);
    }
}