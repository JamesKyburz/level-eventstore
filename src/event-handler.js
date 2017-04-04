const Client = require('./client')

module.exports = ({ stream, since, log }) => {
  return (handlers) => {
    poll()
    let run = true
    function poll () {
      stream(log, since)
      .on('data', (data) => {
        const value = data.value
        const handler = handlers[value.type]
        if (handler) {
          handler(value.payload)
        }
        since = data.seq
      })
      .on('end', () => {
        if (run) setTimeout(poll, 300)
      })
    }

    return () => { run = false }
  }
}
