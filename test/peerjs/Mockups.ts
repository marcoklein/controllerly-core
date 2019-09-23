import './faker';
import Peer, { DataConnection } from "peerjs";



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

export class PeerMock extends Peer {

    connectSuccessfull: boolean = true;



    connect(id: string, options: Peer.PeerConnectOption): DataConnectionMock {
        let connection = new DataConnectionMock();
        setTimeout(() => {
            if (this.connectSuccessfull) {
                Object.call(this.on, 'open');
                //@ts-ignore
                //this.emit('open', connection);
            }
        }, 500);
        return connection;
    }
}