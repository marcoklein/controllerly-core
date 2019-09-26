import { expect } from 'chai';
import 'mocha';
import { delay } from './TestUtils';
import Peer, { DataConnection } from "peerjs";

import { ControllerlyServer, ServerState } from '../src/ControllerlyServer';
import { ControllerlyClient } from '../src/ControllerlyClient';




describe('ControllerlyServer test', function() {
    // increase default timeout
    this.timeout(10000);

    let server: ControllerlyServer;
    let client: ControllerlyClient;

    before(() => {
        server = new ControllerlyServer();
        client = new ControllerlyClient();
        
    });

    describe('#start()', () => {
        it('should be stopped', () => {
            expect(server.state).to.equal(ServerState.STOPPED);
            expect(server.peer).to.be.undefined;
        })
        it('should connect', done => {
            server.start().then((id: string) => {
                expect(server.connectionCode).to.equal(id);
                expect(server.peer).not.to.be.undefined;
                done();
            }).catch(e => {
                done(e);
            });
        });
        it('should be running', () => {
            expect(server.state).to.equal(ServerState.RUNNING);
        });
    });

    describe('#onConnection()', () => {
        it('should trigger the client connected callback', done => {
            server.onClientConnected.once(() => {
                done();
            });
            server.onClientConnected.emit(null);
        });
    })

    
});
