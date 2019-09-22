

import { DataConnection } from 'peerjs';

/**
 * Super class of the client and server connection.
 * 
 * Implements basic message sending and keep alive functionality.
 * The keep alive mechanism is active per default and continuously exchanges ping pong messages.
 * This ensures that the WebRTC connection stays active and measures the latency.
 */
export abstract class AbstractPeerConnection {

}