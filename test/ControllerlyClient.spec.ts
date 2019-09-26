import { expect } from 'chai';
import 'mocha';
import { delay } from './TestUtils';
import Peer, { DataConnection } from "peerjs";

import { ControllerlyServer, ServerState } from '../src/ControllerlyServer';
import { ControllerlyClient, ClientState } from '../src/ControllerlyClient';
import { HostedConnection } from '../src/HostedConnection';
import { Listener } from '../src/TypedEvent';




describe('ControllerlyClient test', function() {
    // increase default timeout
    this.timeout(10000);

    let server: ControllerlyServer;
    let client: ControllerlyClient;

    before(() => {
        server = new ControllerlyServer();
        client = new ControllerlyClient();

        // start the server
        return server.start();
    });

    describe('#connect', () => {
        it('should connect to the server', async () => {
            try {
                await client.connect(server.connectionCode);
            } catch (e) {
                console.error(e);
            }
        });
        it('should be connected', () => {
            expect(client.isConnected).to.be.true;
            expect(client.state).to.equal(ClientState.CONNECTED);
            expect(client.connection).not.to.be.undefined;
        });
    });

    describe('#sendMessage', () => {
        it('should send a null data', () => {
            expect(() => {client.sendMessage('testMessage', null)}).not.to.throw();
        });
        it('should send a message', () => {
            expect(() => {client.sendMessage('testMessage', { data: 3 })}).not.to.throw();
        });
        it('should update statistics', () => {
            expect(client.totalMessageCount).to.equal(2);
            expect(client.manager.pendingCount).to.equal(2);
        });
        // delay to wait for message ACKs
        delay(1000);
        it('should acknowledge the messages', () => {
            // NOTE: remove this test if it fails to often
            // it may fail do to the unreliable UDP protocol of WebRTC!
            expect(client.manager.pendingCount).to.equal(0);
        });
    });

    describe('#disconnect', () => {
        before(() => {
            client.disconnect();
        });
        it('should disconnect', () => {
            expect(client.isConnected).to.be.false;
            expect(client.state).to.equal(ClientState.DISCONNECTED);
        })
    })

    
});