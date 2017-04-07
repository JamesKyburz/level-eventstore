const test = require('tape')
const http = require('http')

const client = require('../').client({
  wsUrl: 'ws://guest:guest@localhost:5000',
  httpUrl: 'http://guest:guest@localhost:5000'
})

const { spawn } = require('child_process')
const rimraf = require('rimraf')
const path = require('path')

let server

test('start server', (t) => {
  rimraf(path.join(__dirname, '../eventstore'), (err) => {
    t.error(err, 'remove eventstore')
    server = spawn('node', [ path.join(__dirname, '../src/server') ])
    process.on('exit', server.kill.bind(server))
    ;(function ping () {
      const request = http.get('http://guest:guest@localhost:5000/ping', (res) => {
        if (res.statusCode === 200) return t.end()
        setTimeout(ping, 300)
      })
      request.on('error', setTimeout.bind(null, ping, 300))
    })()
  })
})

test('event is mandatory', (t) => {
  t.plan(1)
  client.append(null, (err) => {
    t.equals(err.message, 'event must be specified')
  })
})

test('event type mandatory', (t) => {
  t.plan(1)
  const event = validEvent()
  delete event.type
  client.append(event, (err) => {
    t.equals(err.message, 'event type must be specified')
  })
})

test('event log mandatory', (t) => {
  t.plan(1)
  const event = validEvent()
  delete event.log
  client.append(event, (err) => {
    t.equals(err.message, 'event log must be specified')
  })
})

test('event payload mandatory', (t) => {
  t.plan(1)
  const event = validEvent()
  delete event.payload
  client.append(event, (err) => {
    t.equals(err.message, 'event payload must be specified')
  })
})

test('append with valid event', (t) => {
  t.plan(1)
  client.append({
    type: 'x',
    log: 'x',
    payload: {
      foo: 'bar'
    }
  }, (err) => {
    t.error(err, 'event saved')
  })
})

test('event handlers', (t) => {
  t.plan(1)
  const events = [
    { type: 'signup', log: 'users', payload: { email: 'foo@bar.com', id: 'd45e9c20-dec1-4ffc-b527-ebaa5e40a543' } },
    { type: 'verifyAccount', log: 'users', payload: { id: 'd45e9c20-dec1-4ffc-b527-ebaa5e40a543' } }
  ]
  const state = {}
  const close = client.handleEvents({ log: 'users', onError: (err) => console.error(err) })({
    signup (payload, cb) {
      state[payload.id] = { email: payload.email }
      cb(null)
    },
    verifyAccount (payload, cb) {
      state[payload.id].verified = true
      t.deepEqual(state, {
        'd45e9c20-dec1-4ffc-b527-ebaa5e40a543': {
          email: 'foo@bar.com',
          verified: true
        }
      }, 'correct state created')
      cb(null)
      close()
    }
  })
  events.forEach((e) => client.append(e, { retry: true }, (err, data) => {
    if (err) return t.fail(`failed to append event ${err}`)
  }))
})

test('generator event handlers', (t) => {
  t.plan(1)
  const state = {}
  const close = client.handleEvents({ log: 'users' })({
    * signup (payload) {
      state[payload.id] = { email: payload.email }
    },
    * verifyAccount (payload) {
      state[payload.id].verified = true
      t.deepEqual(state, {
        'd45e9c20-dec1-4ffc-b527-ebaa5e40a543': {
          email: 'foo@bar.com',
          verified: true
        }
      }, 'correct state created')
      close()
    }
  })
})

test('cleanup', (t) => {
  if (server) server.kill()
  t.end()
  process.exit(0)
})

function validEvent () {
  return {
    type: 'x',
    log: 'users',
    payload: {
      name: 'x'
    }
  }
}
