import { expect } from 'chai';
import 'mocha';
import { delay } from './TestUtils';

import { ControllerlyServer, ServerState } from '../src/ControllerlyServer';
import { ControllerlyClient } from '../src/ControllerlyClient';
import { HostedConnection } from '../src/HostedConnection';
import { ConnectionState } from '../src/AbstractPeerConnection';




describe('ControllerlyServer test', function() {
    // increase default timeout
    this.timeout(20000);

    let server: ControllerlyServer;
    let client: ControllerlyClient;
    let hostedConnection: HostedConnection;
    const messageData = {
        text: 'bla',
        number: 44
    }

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
            server.onClientConnected.once((conn) => {
                hostedConnection = conn
                done();
            });
            client.connect(server.connectionCode);
        });
        it('should return a hosted connection', () => {
            expect(hostedConnection).not.to.be.undefined;
            expect(hostedConnection.state).to.equal(ConnectionState.CONNECTED);
            expect(hostedConnection.isConnected).to.be.true;
        });
        it('should be in the clients server list', () => {
            expect(server.clients.length).to.equal(1);
        });
    })

    describe('HostedConnection', () => {
        describe('#onMessage()', () => {
            it('should receive a message', done => {
                hostedConnection.onMessage.once((message) => {
                    expect(message.type).to.equal('test');
                    expect(message.data).to.deep.equal(messageData);
                    done();
                });
                client.sendMessage('test', messageData)
            });
        });
        describe('#on disconnect', () => {
            before(() => {
                client.disconnect();
            });
            delay(10000);
            it('should be state disconnected', () => {
                expect(hostedConnection.state).to.equal(ConnectionState.DISCONNECTED);
            });
            it('should be removed from the server', () => {
                expect(server.clients.length).to.equal(0);
            });
        });
    })

    
});
