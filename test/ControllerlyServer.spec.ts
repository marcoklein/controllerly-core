import { expect } from 'chai';
import 'mocha';
import { delay } from './TestUtils';
import Peer, { DataConnection } from "peerjs";

import { ControllerlyServer, ServerState } from '../src/ControllerlyServer';




describe('ControllerlyServer test', () => {

    let server: ControllerlyServer;

    before(() => {
        server = new ControllerlyServer();
        
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
        }).timeout(10000);
        it('should be running', () => {
            expect(server.state).to.equal(ServerState.RUNNING);
        });
    });

    
});
