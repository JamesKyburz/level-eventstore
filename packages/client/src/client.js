const websocket = require('websocket-stream')
const multileveldown = require('multileveldown')
const dbs = {}

module.exports = client

function client (opt = {}) {
  const defaults = {
    keyEncoding: 'utf8',
    valueEncoding: 'json',
    retryTimeout: 3000
  }

  const { keyEncoding, valueEncoding, retryTimeout, url } = Object.assign(
    {},
    defaults,
    opt
  )

  if (!url) throw new Error('url must be specified')

  const cacheKey = keyEncoding + valueEncoding + url
  let db = dbs[cacheKey]
  let closed = false
  let ws
  const close = () => {
    delete dbs[cacheKey]
    if (ws) ws.destroy()
    closed = true
  }

  if (!db) {
    db = dbs[cacheKey] = multileveldown.client({
      keyEncoding,
      valueEncoding,
      retry: true
    })
    const connect = () => {
      if (closed) return
      ws = websocket(url)
      const remote = db.connect()
      session(remote, ws)
      ws.on('close', () => setTimeout(connect, retryTimeout))
    }
    connect()
  }

  return { db, close }
}

function session (dbStream, wsStream) {
  wsStream.on('error', () => wsStream.destroy())
  wsStream.on('close', () => {
    dbStream.destroy()
  })
  wsStream.on('data', data => {
    dbStream.write(data)
  })
  dbStream.on('data', data => {
    wsStream.write(data)
  })
}