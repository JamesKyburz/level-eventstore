const Client = require('./client')

module.exports = ({ url, retry, since, log }) => {
  const client = Client({ url, retry })

  return (handlers) => {
    poll()
    let run = true
    function poll () {
      client.stream(log, since)
      .on('data', (data) => {
        const value = data.value
        const handler = handlers[value.type]
        if (handler) {
          delete value.type
          handler(value)
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
