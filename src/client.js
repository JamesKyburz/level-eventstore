const Client = require('leveldb-mount/client')
const Logs = require('./logs')
const fetch = require('make-fetch-happen')
const validateEvent = require('./validate-event')
const eventHandler = require('./event-handler')

module.exports = ({ wsUrl, httpUrl }) => {
  return { append, handleEvents }

  function append (event, options, cb) {
    if (typeof options === 'function') {
      cb = options
      options = {}
    }

    const error = validateEvent(event)
    if (error) return cb(error)

    fetch(httpUrl + '/append', {
      method: 'PUT',
      retry: options.retry,
      body: JSON.stringify(event)
    })
    .then((res) => {
      if (res.status !== 200) {
        return cb(new Error({ status: res.status }))
      }
      return res.json()
    })
    .then((json) => cb(null, json))
    .catch(cb)
  }

  function handleEvents ({ log, since }) {
    const client = Client({ url: wsUrl })
    const logs = Logs(client.db)
    return eventHandler({
      stream (log, since) { return logs.createReadStream(log, { since }) },
      since,
      log
    })
  }
}
