# level-eventstore

eventstore using leveldb

[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://github.com/feross/standard)

# server
```sh
yarn start
```

### Docker

Docker images hosted at https://hub.docker.com/r/jameskyburz/level-eventstore/

docker pull jameskyburz/level-eventstore:v1.0.0

# Running in docker

```
ᐅ docker pull jameskyburz/level-eventstore:v1.0.0
ᐅ docker run --rm --name level-eventstore -p 5000:5000 jameskyburz/level-eventstore:v1.0.0
```

# example adding events

```js
const retry = 3000
const since = 0
const url = 'ws://guest:guest@localhost:5000'
const client = require('./').client({ url, retry })

client.append({
  log: 'users',
  type: 'signup',
  email: 'foo@bar'
}, done)

client.append({
  log: 'users',
  type: 'signup',
  email: 'baz@car'
}, done)

function done (err) {
  client.stream('users', since)
    .on('data', (data) => {
      since = data.seq
      console.log(data)
    )
}```

```js
{ log: 'users',
  seq: 1,
  value:
   { type: 'signup',
     email: 'foo@bar',
     id: '5dd8ea73-637c-4c2c-bb7a-a4c2edc8f736',
     createdAt: 1490864934511 } }
{ log: 'users',
  seq: 2,
  value:
   { type: 'signup',
     email: 'baz@car',
     id: '9988dd58-802c-4afb-8af9-b4797dc08a03',
     createdAt: 1490864934512 } }
```

# example event lister

```js
const url = 'ws://guest:guest@localhost:5000'
const close = require('./').eventHandler({ url, log: 'users' })({
  signup (event) {
    console.log('insert', event)
  }
})
```
