import { expect } from 'chai';
import 'mocha';
import { MessageManager } from '../src/MessageManager';
import { Message } from '../src/Message';
import { delay } from './TestUtils';


describe('MessageManager test', () => {

    let manager: MessageManager;
    let testMessage: Message;
    let secondMessage = new Message(2, 'ack_me', { data: 'data'} );

    before('Prepare variables', () => {

        manager = new MessageManager();
        manager.messageTimeout = 400; // set timeout to 400ms for testing
    
        testMessage = new Message(1, 'TEST', { data: 'data' });
    });


    describe('#put() - timeout message', function() {
        it('should put a message', () => {
            manager.put(testMessage);
        });
        it('should increase count by 1', () => {
            expect(manager.pendingCount).to.equal(1);
        });
        it('should create a new pending entry', () => {
            expect(manager.pendingMessages[1]).to.equal(testMessage);
        });

        delay(1000);
        
        it('should timeout the message after 1s', () => {
            expect(testMessage.timeout).to.be.true;
            expect(manager.pendingCount).to.equal(0);
        });
    });
    describe('#put() - acknowledge message', function() {
        it('should put a message', () => {
            manager.put(secondMessage);
        });
        it('should increase count by 1', () => {
            expect(manager.pendingCount).to.equal(1);
        });
        it('should create a new pending entry', () => {
            expect(manager.pendingMessages[secondMessage.id]).to.equal(secondMessage);
        });
        it('should ack message', () => {
            manager.acknowledge(secondMessage.id);
        })

        delay(1000);
        
        it('message should be acknowledged', () => {
            expect(secondMessage.acknowledged).not.to.be.undefined;
            expect(secondMessage.timeout).to.be.false;
            expect(secondMessage.latency).to.be.a('number');
            expect(manager.pendingCount).to.equal(0);
        });
    });

    after('Destroy the manager', () => {
        manager.destroy();
    });
});