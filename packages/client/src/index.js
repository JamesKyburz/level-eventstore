const Client = require('./client')
const Logs = require('./logs')
const fetch = require('make-fetch-happen')
const validateEvent = require('./validate-event')
const eventHandler = require('./event-handler')
const Streams = require('./streams')
const through = require('through2')
const pump = require('pump')

module.exports = ({ wsUrl, httpUrl }) => {
  return { append, handleEvents, streamById, logStream, logList }

  function append (event, options, cb) {
    if (typeof options === 'function') {
      cb = options
      options = {}
    }

    options = Object.assign({}, options)

    if (!options) options = {}

    if (!cb) {
      cb = (err, data) => {
        if (err) return Promise.reject(err)
        return data
      }
    }

    const error = validateEvent(event)
    if (error) return cb(error)

    return fetch(httpUrl + '/append', {
      method: 'PUT',
      retry: options.retry,
      body: JSON.stringify(event)
    })
      .then(res => {
        if (res.status !== 200) {
          return res.text().then(message => Promise.reject(new Error(message)))
        }
        return res.json()
      })
      .then(json => cb(null, json))
      .catch(cb)
  }

  function logList (cb) {
    const client = Client({ url: wsUrl })
    const logs = Logs(client.db)
    return logs.list(cb)
  }

  function logStream (log, opts, cb) {
    if (typeof opts === 'function') {
      cb = opts
      opts = {}
    }
    const client = Client({ url: wsUrl })
    const logs = Logs(client.db)
    return logs
      .createReadStream(log, opts)
      .on('error', cb)
      .on('end', cb)
  }

  function streamById (log, id, opts, cb) {
    if (typeof opts === 'function') {
      cb = opts
      opts = {}
    }
    const client = Client({ url: wsUrl })
    const stream = Streams(client.db)
    const logs = Logs(client.db)
    const rs = stream.createReadStream(log + id, opts)
    const map = through.obj((data, enc, cb) => {
      logs.get(log, data.value, (err, value) => {
        if (err) return cb(err)
        cb(null, Object.assign({ seq: data.seq, value }))
      })
    })
    const dest = through.obj()
    process.nextTick(() => pump(rs, map, dest, cb))
    return dest
  }

  function handleEvents ({ log, since, onError, updateSince, ignore }) {
    const client = Client({ url: wsUrl })
    const logs = Logs(client.db)
    const close = () => client.close()
    return eventHandler({
      stream (log, since) {
        return logs.createReadStream(log, { since })
      },
      since,
      log,
      onError,
      updateSince,
      ignore,
      close
    })
  }
}
