import { Message } from "./Message";


export class MessageManager {

    messageTimeout: number = 1000;
    private messageTimer: any;

    private _pendingCount: number = 0;
    private _pendingMessages: {[key: number]: Message} = {};
    
    constructor() {
    }

    /**
     * Stores the given message and waits for the ACK message.
     * 
     * @param message 
     */
    put(message: Message) {
        this._pendingMessages[message.id] = message;
        this._pendingCount++;

        message.timestamp = Date.now();

        this.startPendingTimer();
    }

    private startPendingTimer() {
        if (this._pendingCount > 0 && !this.messageTimer) {
            // start message timer
            this.messageTimer = setTimeout(() => {
                this.messageTimer = undefined;
                this.updatePending();
                this.startPendingTimer();
            }, this.messageTimeout);
        }
    }

    acknowledge(messageId: number) {
        let message = this._pendingMessages[messageId];
        if (!message) {
            console.info('Received ACK message for Message that already timed out.');
            return;
        }
        message.acknowledged = Date.now();
        message.timeout = false;

        this.removeFromPending(message);
    }

    /**
     * Mark message as timed out.
     * 
     * @param messageId 
     */
    private timeout(msg: Message) {
        msg.acknowledged = undefined;
        msg.timeout = true;

        this.removeFromPending(msg);
    }

    private removeFromPending(message: Message) {
        // remove from pending
        delete this._pendingMessages[message.id];
        this._pendingCount--;
    }


    /**
     * Update list of pending messages and remove messages that timed out.
     */
    private updatePending() {
        // loop through all pending messages and check which timed out
        const now = Date.now();
        for (let msgId in this._pendingMessages) {
            const msg = this._pendingMessages[msgId];
            if (msg.timestamp + this.messageTimeout < now) {
                // timeout
                this.timeout(msg);
            }
        }
    }

    /**
     * Stop updating the manager.
     */
    destroy() {
        if (this.messageTimer) {
            clearTimeout(this.messageTimer);
        }
    }

    /* Getter and Setter */

    get pendingCount(): number {
        return this._pendingCount;
    }

    get pendingMessages(): {[key: number]: Message} {
        return this._pendingMessages;
    }

}