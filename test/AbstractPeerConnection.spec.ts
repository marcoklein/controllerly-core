

import { expect } from 'chai';
import 'mocha';
import { AbstractPeerConnection } from '../src/AbstractPeerConnection';

class AbstractPeerConnectionMock extends AbstractPeerConnection {

}

describe('AbstractPeerConnection test', () => {

    let peerConnection = new AbstractPeerConnectionMock();

    describe('#sendMessage', () => {
        let msg = {
            text: 'hello'
        }
        it('should throw an error', () => {
            expect(() => {peerConnection.sendMessage('msgType', msg)}).to.throw;
        });
    });

});