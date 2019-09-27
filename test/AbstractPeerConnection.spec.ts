import { expect } from 'chai';
import 'mocha';

import { AbstractPeerConnection } from '../src/AbstractPeerConnection';
import { DataConnection } from 'peerjs';
import { Message } from '../src/Message';

export class DataConnectionMock implements DataConnection {
    send(data: any): void {

    }
    close(): void {
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
    open: boolean = true;
    peerConnection: RTCPeerConnection;
    peer: string;
    reliable: boolean;
    serialization: string;
    type: string;
    bufferSize: number;
}

class AbstractPeerConnectionMock extends AbstractPeerConnection {
    registerConnection(connection: DataConnection) {
        super.registerConnection(connection);
    }

    protected onMessageCallback(msg: Message): void {
        throw new Error("Method not implemented.");
    }

    protected onConnectionCloseCallback(): void {
        throw new Error("Method not implemented.");
    }
    protected onConnectionErrorCallback(err: any): void {
        throw new Error("Method not implemented.");
    }

}


describe('AbstractPeerConnection test', () => {

    let peerConnection = new AbstractPeerConnectionMock();
    let dataConnection = new DataConnectionMock();
    let data = {
        text: 'hello',
        number: 4711
    }

    describe('#sendMessage() no connection', () => {
        it('should throw an error', () => {
            expect(() => {peerConnection.sendMessage('msgType', data)}).to.throw();
        });
        it('should be 0', () => {
            expect(peerConnection.totalMessageCount).to.equal(0);
        });

    });

    describe('#sendMessage() with connection', () => {
        let message: Message;

        before(() => {
            peerConnection.registerConnection(dataConnection);
        });

        it('should not be undefined', () => {
            expect(peerConnection.connection).not.to.be.undefined;
        });

        it('should be connected', () => {
            expect(peerConnection.isConnected).to.be.true;
        });

        it('should return a message', () => {
            expect(() => {message = peerConnection.sendMessage('msgType', data)}).not.to.throw();
            expect(message).not.to.be.undefined;
        });
        it('message has data and type', () => {
            expect(message.data).to.equal(data);
            expect(message.type).to.equal('msgType');
        });
        it('should have the id 1', () => {
            expect(message.id).to.equal(1);
        });
        it('should return 1 for total count', () => {
            expect(peerConnection.totalMessageCount).to.equal(1);
        });
    });

    describe('#onMessage()', () => {

    });

    after(() => {
        peerConnection.registerConnection(undefined);
    });

});