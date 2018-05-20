# level-eventstore

eventstore using leveldb

[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://github.com/feross/standard)
[![build status](https://api.travis-ci.org/JamesKyburz/level-eventstore.svg)](https://travis-ci.org/JamesKyburz/level-eventstore)
[![Docker Build Status](https://img.shields.io/docker/build/jameskyburz/level-eventstore.svg)]()
[![downloads](https://img.shields.io/npm/dm/level-eventstore.svg)](https://npmjs.org/package/level-eventstore)
[![Docker Pulls](https://img.shields.io/docker/pulls/jameskyburz/level-eventstore.svg)]()
[![Greenkeeper badge](https://badges.greenkeeper.io/JamesKyburz/level-eventstore.svg)](https://greenkeeper.io/)

# server
```sh
npm start
```

### Docker

Docker images hosted at https://hub.docker.com/r/jameskyburz/level-eventstore/

docker pull jameskyburz/level-eventstore:version

# Running in docker

```sh
ᐅ docker pull jameskyburz/level-eventstore:version
ᐅ docker run --rm --name level-eventstore -p 5000:5000 jameskyburz/level-eventstore:version
```

# example

```js
const wsUrl = 'ws://guest:guest@localhost:5000'
const httpUrl = 'http://guest:guest@localhost:5000'
const client = require('level-eventstore-client')({ wsUrl, httpUrl })

await client.append({
  log: 'users',
  type: 'signup',
  payload: {
    email: 'foo@bar'
  }
})

await client.append({
  log: 'users',
  type: 'verifyAccount',
  payload: {
    id: '38390783-cd60-4190-8b94-a3d4ac24d653'
  }
})

const close = client.handleEvents({ log: 'users', since: 0 })({
  async signup (payload) {
    console.log('insert', payload)
  },
  async verifyAccount (payload) {
    console.log('verify', payload)
  }
})

insert { email: 'foo@bar', id: '1def7ce5-9da4-40cc-8594-c739fad36a2b' }
verify { id: '38390783-cd60-4190-8b94-a3d4ac24d653' }

```

event handlers can be generators, async functions, or vanilla functions in this case they need an extra `callback` argument.

# license

[Apache License, Version 2.0](LICENSE)
