import { AbstractPeerConnection } from "./AbstractPeerConnection";
import { Message, MessageData } from "./Message";

export class ControllerlyClient extends AbstractPeerConnection {
    
    constructor() {
        super();
    }

    
    protected onMessage(msg: MessageData): void {
    }
    
    protected onConnectionClose(): void {

    }
    protected onConnectionError(err: any): void {

    }
}