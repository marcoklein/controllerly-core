

export class Message {
    
    readonly id: number;
    readonly type: string;
    readonly data: any;

    /**
     * Timestamp, when the message was sent.
     */
    timestamp: number;

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
}