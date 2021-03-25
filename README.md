# `@perion/perion` [![Travis CI Build Status](https://travis-ci.org/jonnylin13/perion.svg?branch=master)](https://github.com/jonnylin13) ![Code coverage](https://img.shields.io/badge/min%20coverage-90%25-green)

A library of Node.js modules that help bring MapleStory private server development to the `npm` ecosystem.
```
npm i --save @perion/perion
```
* Note this project is in early development, use with caution

# Overview

## Core Packages

* @perion/calc

A calculator library that implements standard MapleStory specific calculations such as damage, stat modifiers, experience, and levels.
```node
const calc = require('@perion/calc');

/** Example player stats object */
const playerStats = {base: {str: 4, ...}, hyper: {str: 1, ...}};

/** crypto.calc example */
const modifiedStats = calc.HyperStats(playerStats).applyAll().get();

/** Returns {str: 34, ...} */
```

* @perion/crypto

A cryptography library that exposes everything you need to encrypt/decrypt data for MapleStory.
```node
const crypto = require('@perion/crypto');

/** Example data */
/** Normally you would get this from a socket **/
const payload = Buffer.from([0x1]);
const sendIv = Buffer.from([0x0, 0x2, 0x3, 0x4]);
const recvIv = Buffer.from([0x4, 0x2, 0x1, 0x0]);

/** crypto.Shanda example */
const encrypted = crypto.Shanda.encrypt(payload);
const decrypted = crypto.Shanda.decrypt(payload);

/** Returns the input buffer with the payload encrypted/decrypted using Maple Custom Shanda */

/** crypto.AES example */
/**
  * You must initialize the AES class with:
  * - an IV (Initialization Vector)
  * - a MapleStory version number
  *
  * The IV must have a length of 4
  * As the server, you must send the IV for both send and recv to the client
  */
const sendAES = new crypto.AES(sendIv, 83);
const recvAES = new crypto.AES(recvIv, 83);

const encryptedOut = sendAES.transform(payload);
const decryptedIn = recvAES.transform(payload);

/** Returns the input buffer with the payload encrypted/decryped using Maple AES */
```

* @perion/net

A packet parser using method-chaining syntax for compact and efficient parsing/writing of packet structures.
```node
const net = require('@perion/net');

/** Example buffer */
const data = Buffer.from([1, 2]);

/** net.Packet.Parser example */
const packet = new net.Packet.Parser(data);
const fields = ['id', 'name', 'hp'];
const unpacked = packet.int().mapleascii().int().collect(fields);

/** Returns {id: <number>, name: <string>, hp: <number>} */

/** net.Packet.Writer example */

/** Initialize with length */
let packet = new net.Packet.Writer(5);
packet = packet.byte(0x0).int(9).buffer();

/** Returns the buffer with data */

```

* @perion/core

The core library for `@perion`, contains useful abstractions and tools. For example, StateContainer is an async state container that can be serialized and sent over the wire.
```node
const core = require('@perion/core');

/** core.StateContainer example */
const initialState = {
  id: 1,
  hp: 100,
  mp: 100
};
const playerState = new core.StateContainer(initialState);

async () => {
  const id = await playerState.get('id');
  /** id is 1 */
  await playerState.set('hp', 90);
  const hp = await playerState.get('hp');
  /** hp is 90 */
  const buffer = playerState.pack();
  const copiedPlayerState = core.StateContainer.from(buffer);
}();
```

* @perion/script

A generic scripting engine for NPCs, events, maps, etc.

```node
const script = require('@perion/script');

/** Generic implementation */
const scriptProvider = new script.ScriptProvider();
const contextProvider = new script.ContextProvider();
const engine = new script.Engine(scriptProvider, contextProvider);
engine.handleRequest({id: '0', type: 'npc'}).then(res => {
  assert(res === true);
}).catch(err => {
  console.log(err);
  assert(err === null || err === undefined);
});
```

* @perion/wz

A WZ library that can read and write to the WZ file format.

```node
const wz = require('@perion/wz');

/** AES example **/
const AES = wz.AES;

/** Example buffer **/
const data = Buffer.from([
  0x01, 0x02, 0x0f, 0xef
  0x01, 0x02, 0x0f, 0xef
  0x01, 0x02, 0x0f, 0xef
  0x01, 0x02, 0x0f, 0xef
]);
const aes = new AES('GMS');
const transformed = aes.transform(data);

/** Returns the transformed buffer */
```

## Neat Features

* Uses Google's recommended JS style guidelines, fully documented code including full JSDoc comments
* Modular packages, so use what you want
* Full test coverage, with a minimum coverage threshold of 90%
* Minimal dependencies

# Project Goals

## In Progress

* Networking protocol
* Damage calculations
* Event timers
* WZ and NX file format
* Generic MapleStory abstractions
* Multiple MapleStory versions

# Project Overview

## Linter
```
npm run lint
```
## Test
```
npm run test
npm run lcov
```
## Documentation
Click [here](https://jonnylin13.github.io/perion/) for the code documentation!

# Contributing
For now, there are no contribution guidelines. I only ask that you follow the `eslint` rules when contributing a pull request. Thanks!

[![ForTheBadge built-with-love](http://ForTheBadge.com/images/badges/built-with-love.svg)](https://GitHub.com/Naereen/)