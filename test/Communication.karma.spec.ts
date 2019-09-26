import { expect } from 'chai';
import { delay } from './TestUtils';

//import { ControllerlyServer } from '../src/ControllerlyServer';
//import { ControllerlyClient } from '../src/ControllerlyClient';

describe('TestTemplate test', () => {


    describe('#method() - comment', () => {
        it('should succeed', () => {
            expect(true).to.be.true;
        });
    });
    
  });

/*describe('Connection test', () => {
    let server: ControllerlyServer;
    let client: ControllerlyClient;

    before(() => {
        server = new ControllerlyServer();
        client = new ControllerlyClient();
    });

    describe('Connecting', () => {
        it('should start server', function(done) {
            server.start().then(controllerly => {
                expect(controllerly).not.to.be.undefined;
                done();
            }).catch(err => {
                done(err);
            });
        });
    });
});
*/