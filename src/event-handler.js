const runGenerator = require('run-duck-run')
const isGenerator = require('is-generator-function')
const through = require('through2')
const pump = require('pump')

module.exports = ({ stream, since, log, onError, updateSince }) => {
  onError = onError || (f => f)
  updateSince = updateSince || (f => f)
  return (handlers) => {
    poll()
    let run = true
    function poll () {
      const rs = stream(log, since)
      const handle = through.obj((data, enc, cb) => {
        const value = data.value
        const handler = handlers[value.type]
        const handled = (err) => {
          if (err) return cb(err)
          updateSince(data.seq)
          since = data.seq
          cb(null)
        }
        if (handler) {
          if (isGenerator(handler)) {
            runGenerator(handler, onError)(value.payload, handled)
          } else {
            handler(value.payload, handled)
          }
        } else {
          handled(null)
        }
      })

      pump(rs, handle, (err) => {
        if (err) onError(err)
        if (run) setTimeout(poll, err ? 30000 : 300)
      })
    }

    return () => { run = false }
  }
}
