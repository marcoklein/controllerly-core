

export class Message {
    
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

    constructor(id: number, type: string, data: any) {
        this.id = id;
        this.type = type;
        this.data = data;
    }

    toData() {
        return {
            id: this.id,
            type: this.type,
            data: this.data
        }
    }

    /**
     * Travel time of message - difference of timestamp and acknowledged.
     */
    get latency(): number {
        return this.timestamp !== undefined && this.acknowledged !== undefined ? this.acknowledged - this.timestamp : null;
    }
}