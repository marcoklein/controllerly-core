/**

Copyright (c) 2015 Michelle Bu and Eric Zhang, http://peerjs.com

(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

import { WebSocket } from 'mock-socket';

const fakeGlobals = {
    WebSocket,
    MediaStream: class MediaStream {
        private _tracks: MediaStreamTrack[] = [];

        constructor(tracks?: MediaStreamTrack[]) {
            if (tracks) {
                this._tracks = tracks;
            }
        }

        getTracks(): MediaStreamTrack[] {
            return this._tracks;
        }

        addTrack(track: MediaStreamTrack) {
            this._tracks.push(track);
        }
    },
    MediaStreamTrack: class MediaStreamTrack {
        kind: string;
        id: string;

        private static _idCounter = 0;

        constructor() {
            this.id = `track#${fakeGlobals.MediaStreamTrack._idCounter++}`;
        }
    },
    RTCPeerConnection: class RTCPeerConnection {
        private _senders: RTCRtpSender[] = [];

        close() { }

        addTrack(track: MediaStreamTrack, ..._stream: MediaStream[]): RTCRtpSender {
            const newSender = new RTCRtpSender();
            newSender.replaceTrack(track);

            this._senders.push(newSender);

            return newSender;
        }

        // removeTrack(_: RTCRtpSender): void { }

        getSenders(): RTCRtpSender[] { return this._senders; }
    },
    RTCRtpSender: class RTCRtpSender {
        readonly dtmf: RTCDTMFSender | null;
        readonly rtcpTransport: RTCDtlsTransport | null;
        track: MediaStreamTrack | null;
        readonly transport: RTCDtlsTransport | null;

        replaceTrack(withTrack: MediaStreamTrack | null): Promise<void> {
            this.track = withTrack;

            return Promise.resolve();
        }
    }
}


Object.assign(global, fakeGlobals);
Object.assign(window, fakeGlobals);