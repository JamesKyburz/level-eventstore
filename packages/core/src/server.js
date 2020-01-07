const base = require('server-base')
const db = require('./db')
const routes = require('./routes')
const sequences = require('./sequences')
const multileveldown = require('multileveldown')
const websocket = require('websocket-stream')
const auth = require('./auth')

sequences((err, sequences) => {
  if (err) throw err
  const server = base('level-eventstore', routes({ sequences })).start(5000)

  websocket.createServer({ server }, handleWs)

  function handleWs (wsStream, request) {
    auth(request, err => {
      if (err) {
        wsStream.destroy()
        request.destroy()
      } else {
        const dbStream = multileveldown.server(db)
        session(dbStream, wsStream)
      }
    })
  }

  function session (dbStream, wsStream) {
    wsStream.on('error', () => wsStream.destroy())
    wsStream.on('close', () => dbStream.destroy())
    wsStream.on('data', data => dbStream.write(data))
    dbStream.on('data', data => wsStream.write(data))
  }
})
