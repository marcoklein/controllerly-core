import { expect } from 'chai';
import { delay } from './TestUtils';

import { ControllerlyServer } from '../src/ControllerlyServer';
import { ControllerlyClient } from '../src/ControllerlyClient';

/**
 * Testing Server and Client communication through HostedConnections.
 */


describe('Connection test', () => {
    let server: ControllerlyServer;
    let client: ControllerlyClient;

    before(() => {
        // initialize server and client
        server = new ControllerlyServer();
        client = new ControllerlyClient();
    });

    describe('Connection', () => {
        it('should start server', function(done) {
            server.start().then(controllerly => {
                expect(controllerly).not.to.be.undefined;
                done();
            }).catch(err => {
                done(err);
            });
        });
        it('have no connection', () => {
            expect(server.clients).to.be.empty;
        });

    });
});
