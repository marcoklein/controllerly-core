
import './setup';
import { expect } from 'chai';
import 'mocha';
import { delay } from './TestUtils';
import Peer, { DataConnection } from "peerjs";

import { ControllerlyServer, ServerState } from '../src/ControllerlyServer';
import { Server } from 'mock-socket';
import { PRE_ID } from '../src/globals';


const TEST_ID = 'testId';


describe('ControllerlyServer test', () => {

    let webRTCMockServer: Server;
    let server: ControllerlyServerMock;

    before(() => {
        const fakeUrl = 'ws://localhost:8080/peerjs?key=peerjs&id=' + PRE_ID + TEST_ID + '&token=testToken';
        //const fakeUrl = 'ws://localhost:8080/peerjs?key=peerjs&id=1&token=testToken';

        server = new ControllerlyServerMock();
        
        webRTCMockServer = new Server(fakeUrl);
        webRTCMockServer.start();
        // start fake server
        webRTCMockServer.on('connection', socket => {
            console.log('on connection');
            socket.on('message', data => {
                socket.send('test message from mock server');
            });

            socket.send('welcome')
        });
    });
    describe('create mock server', () => {
        it('should listen a mock server', () => {
            expect(webRTCMockServer).not.to.be.undefined;
        });
    })

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

    after(() => {
        webRTCMockServer.close();
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