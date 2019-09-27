import { expect } from 'chai';
import 'mocha';
import { delay } from './TestUtils';

import { ControllerlyServer } from '../src/ControllerlyServer';
import { ControllerlyClient } from '../src/ControllerlyClient';
import { ConnectionState } from '../src/AbstractPeerConnection';




describe('ControllerlyClient test', function() {
    // increase default timeout
    this.timeout(20000);

    let server: ControllerlyServer;
    let client: ControllerlyClient;

    before(() => {
        server = new ControllerlyServer();
        client = new ControllerlyClient();
    });

    describe('#connect', () => {
        it('should fail to connect', done => {
            let randomConnectionCode = 100 * Math.random() * 10000000000;
            client.connect('' + randomConnectionCode).catch(() => {
                done();
            });
        });

        it('should start the server', () => {
            return server.start();
        });

        it('should be disconnected', () => {
            expect(client.isConnected).to.be.false;
            expect(client.isConnecting).to.be.false;
            expect(client.isDisconnected).to.be.true;
            expect(client.state).to.equal(ConnectionState.DISCONNECTED);
        });
        it('should connect to the server', async () => {
            try {
                await client.connect(server.connectionCode);
            } catch (e) {
                console.error(e);
            }
        });
        it('should be connected', () => {
            expect(client.isConnected).to.be.true;
            expect(client.state).to.equal(ConnectionState.CONNECTED);
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
            expect(client.isConnecting).to.be.false;
            expect(client.isConnected).to.be.false;
            expect(client.isDisconnected).to.be.true;
            expect(client.state).to.equal(ConnectionState.DISCONNECTED);
        })
    })

    
});
