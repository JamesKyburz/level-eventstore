const runGenerator = require('run-duck-run')
const isGenerator = require('is-generator-function')

module.exports = ({ stream, since, log, onError }) => {
  return (handlers) => {
    poll()
    let run = true
    function poll () {
      stream(log, since)
      .on('data', (data) => {
        const value = data.value
        const handler = handlers[value.type]
        if (handler) {
          if (isGenerator(handler)) {
            runGenerator(handler, onError || (f => f))({
              payload: value.payload, since: data.seq
            })
          } else {
            handler({ payload: value.payload, since: data.seq })
          }
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
