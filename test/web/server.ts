import { ControllerlyServer } from '../../src/ControllerlyServer';

console.log('ControllerlyServer Test Script');

let server = new ControllerlyServer();
server.start('testServerId').then(() => {
    console.log('ControllerlyServer connected');
}).catch(err => {
    console.error('ControllerlyServer error: ', err);
});

// use parcel to compile this website...