import { expect } from 'chai';
import 'mocha';
import { delay } from './TestUtils';
import Peer, { DataConnection } from "peerjs";

import { ControllerlyServer, ServerState } from '../src/ControllerlyServer';
import { ControllerlyClient } from '../src/ControllerlyClient';




describe('ControllerlyClient test', function() {
    // increase default timeout
    this.timeout(10000);

    let server: ControllerlyServer;
    let client: ControllerlyClient;

    before(() => {
        server = new ControllerlyServer();
        client = new ControllerlyClient();
        
        // start server
        return server.start();
    });

    describe('#connect', () => {
        it('should connect to the server', async () => {
            try {
                await client.connect(server.connectionCode);
                console.log('connected');
            } catch (e) {
                console.error(e);
            }
            expect(client.isConnected).to.be.true;
        });
    });

    
});
