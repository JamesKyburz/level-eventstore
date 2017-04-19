const runGenerator = require('run-duck-run')
const isGenerator = require('is-generator-function')
const through = require('through2')
const pump = require('pump')

module.exports = ({ stream, since, log, onError, updateSince }) => {
  onError = onError || (f => f)
  updateSince = updateSince || ((seq, cb) => cb(null))
  return (handlers) => {
    poll()
    let run = true
    function poll () {
      const rs = stream(log, since)
      const handle = through.obj((data, enc, cb) => {
        const value = data.value
        const handler = handlers[value.type]
        const next = (err) => {
          if (err) return cb(err)
          since = data.seq
          cb(null)
        }
        const handled = (err) => {
          if (err) return cb(err)
          if (isGenerator(updateSince)) {
            runGenerator(updateSince, next)(data.seq)
          } else {
            updateSince(data.seq, next)
          }
        }
        if (handler) {
          if (isGenerator(handler)) {
            runGenerator(handler, handled)(value.payload)
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
