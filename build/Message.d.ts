export declare class Message {
    readonly id: number;
    readonly type: string;
    readonly data: any;
    /**
     * Timestamp, when the message was sent.
     */
    timestamp: number;
    acknowledged: number;
    /**
     * True if the message timed out.
     */
    timeout: boolean;
    constructor(id: number, type: string, data: any);
    toData(): {
        id: number;
        type: string;
        data: any;
    };
    /**
     * Travel time of message - difference of timestamp and acknowledged.
     */
    readonly latency: number;
}
