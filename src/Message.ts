

export class Message {
    
    readonly id: number;
    readonly type: string;
    readonly data: any;

    /**
     * Timestamp, when the message was sent.
     */
    timestamp: number | null = null;
    acknowledged: number | null = null;
    /**
     * True if the message timed out.
     */
    timeout: boolean = false;

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
        return this.timestamp !== null && this.acknowledged !== null ? this.acknowledged - this.timestamp : -1;
    }
}