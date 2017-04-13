# level-eventstore

eventstore using leveldb

[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://github.com/feross/standard)
[![build status](https://api.travis-ci.org/JamesKyburz/level-eventstore.svg)](https://travis-ci.org/JamesKyburz/level-eventstore)
[![Docker Build Statu](https://img.shields.io/docker/build/jameskyburz/level-eventstore.svg)]()
[![downloads](https://img.shields.io/npm/dm/level-eventstore.svg)](https://npmjs.org/package/level-eventstore)
[![Docker Pulls](https://img.shields.io/docker/pulls/jameskyburz/level-eventstore.svg)]()
[![Known Vulnerabilities](https://snyk.io/test/github/jameskyburz/level-eventstore/badge.svg)](https://snyk.io/test/github/jameskyburz/level-eventstore)

# server
```sh
yarn start
```

### Docker

Docker images hosted at https://hub.docker.com/r/jameskyburz/level-eventstore/

docker pull jameskyburz/level-eventstore:v1.0.0

# Running in docker

```
ᐅ docker pull jameskyburz/level-eventstore:v3.1.3
ᐅ docker run --rm --name level-eventstore -p 5000:5000 jameskyburz/level-eventstore:v3.1.3
```

# example

```js
const wsUrl = 'ws://guest:guest@localhost:5000'
const httpUrl = 'http://guest:guest@localhost:5000'
const client = require('level-eventstore').client({ wsUrl, httpUrl })

client.append({
  log: 'users',
  type: 'signup',
  payload: {
    email: 'foo@bar'
  }
}, (err) => {
  if (err) console.error(err)
})

client.append({
  log: 'users',
  type: 'verifyAccount',
  payload: {
    id: '38390783-cd60-4190-8b94-a3d4ac24d653'
  }
}, (err) => {
  if (err) console.error(err)
})

const close = client.handleEvents({ log: 'users', since: 0 })({
  signup (payload, cb) {
    console.log('insert', payload)
    cb(null)
  },
  verifyAccount (payload, cb) {
    console.log('verify', payload)
    cb(null)
  }
})

insert { email: 'foo@bar', id: '1def7ce5-9da4-40cc-8594-c739fad36a2b' }
verify { id: '38390783-cd60-4190-8b94-a3d4ac24d653' }

```

# license

[Apache License, Version 2.0](LICENSE)
