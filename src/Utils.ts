import Peer, { DataConnection } from "peerjs";
import { PRE_ID, CONNECTION_PROPS } from "./globals";

/**
 * Tries opening a connection, optionally with the given code.
 * 
 * @param connectionCode 
 */
export function openPeerWithId(connectionCode?: string): Promise<Peer> {
    return new Promise((resolve, reject) => {
        let peer: Peer;
        let deregisterCallbacks = () => {
            peer.off('open', openCallback);
            peer.off('error', errorCallback);
            peer.off('close', errorCallback);
        }
        // callback if peer with id could be created
        let openCallback = (id: string) => {
            deregisterCallbacks();
            resolve(peer);
        };
        // callback if peer with id could not be created
        let errorCallback = (err?: any) => {
            deregisterCallbacks();
            reject(err);
        }
        // create peer
        if (!connectionCode) {
            // server gives id
            peer = new Peer(CONNECTION_PROPS);
        } else {
            peer = new Peer(PRE_ID + connectionCode, CONNECTION_PROPS);
        }
        peer.on('open', openCallback);
        peer.on('close', errorCallback);
        peer.on('error', errorCallback);
    });
}

/**
 * Connects with given Peer to a Peer with the given connection code.
 * 
 * @param peer 
 * @param connectionCode 
 */
export function connectToPeerWithId(peer: Peer, connectionCode: string, timeout: number = 5000): Promise<DataConnection> {
    return new Promise((resolve, reject) => {
        // trigger connection request
        let connection = peer.connect(PRE_ID + connectionCode);
        let connectionTimeout = setTimeout(() => {
            errorCallback('Timeout on connection - is Peer open?');
        }, timeout);

        let deregisterCallbacks = () => {
            connection.off('open', openCallback);
            connection.off('close', errorCallback);
            connection.off('error', errorCallback);
            clearTimeout(connectionTimeout);
        }
        let openCallback = () => {
            // connection is open
            deregisterCallbacks();
            resolve(connection);
        };
        // callback if connection with id could not be created
        let errorCallback = (err?: any) => {
            deregisterCallbacks();
            reject(err);
        }
        // register listeners
        connection.on('open', openCallback);
        connection.on('close', errorCallback);
        connection.on('error', errorCallback);
    });
}

export function removeElementFromArray<T>(array: T[], val: T) {
    let index = array.indexOf(val);
    if (index !== -1) {
        array.splice(index, 1);
    }
}