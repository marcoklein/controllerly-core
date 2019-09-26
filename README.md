[![npm version](https://badge.fury.io/js/controllerly-core.svg)](https://badge.fury.io/js/controllerly-core)
[![Build Status](https://travis-ci.org/marcoklein/controllerly-core.svg?branch=master)](https://travis-ci.org/marcoklein/controllerly-core)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.png?v=103)](https://opensource.org/licenses/mit-license.php)s


# controllerly-core
Controllerly Core for Robust Connection Management with WebRTC.

This is the core for Controllerly. It wraps around the PeerJs Data Connection and enhances the existing connection methods. All messages are tracked and performance is measured. Additionally, keep alive messages prevent the connection from "falling asleep".

## Testing
The Karma test framework enables testing of JavaScript within a browser. Controllerly-Core is tested within a headless Chrome browser on travis. You may also run tests by installing Chrome on your PC.

Note that WebRTC has limited browser support by itself which is not tested by this project.

Goal of the testing is to create a real WebRTC connection and test code logic.

https://developers.google.com/web/updates/2017/06/headless-karma-mocha-chai#running_it_all_on_travis_ci

Testing requires an installed version of Chrome.
For complete automated tests we could add puppetteer. They install a headless Chromium: https://github.com/GoogleChrome/puppeteer.
