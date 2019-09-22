import { Message } from "./Message";
export declare class MessageManager {
    messageTimeout: number;
    private messageTimer;
    private _pendingCount;
    private _pendingMessages;
    constructor();
    /**
     * Stores the given message and waits for the ACK message.
     *
     * @param message
     */
    put(message: Message): void;
    private startPendingTimer;
    acknowledge(messageId: number): void;
    /**
     * Mark message as timed out.
     *
     * @param messageId
     */
    private timeout;
    private removeFromPending;
    /**
     * Update list of pending messages and remove messages that timed out.
     */
    private updatePending;
    /**
     * Stop updating the manager.
     */
    destroy(): void;
    readonly pendingCount: number;
    readonly pendingMessages: {
        [key: number]: Message;
    };
}
