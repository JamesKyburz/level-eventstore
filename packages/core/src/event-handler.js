const runGenerator = require('run-duck-run')
const isGenerator = require('is-generator-function')
const through = require('through2')
const pump = require('pump')
const callHandler = (fn, cb) => {
  return payload => {
    if (isGenerator(fn)) {
      runGenerator(fn, cb)(payload)
    } else {
      const result = fn(payload, cb)
      if (result && result.then) {
        result.then(data => cb(null, data)).catch(cb)
      }
    }
  }
}

module.exports = ({ stream, since, log, onError, updateSince, close }) => {
  onError = onError || (f => f)
  updateSince = updateSince || ((seq, cb) => cb(null))
  return handlers => {
    let run = true
    poll()
    function poll () {
      if (!run) return
      const rs = stream(log, since)
      const handle = through.obj((data, enc, cb) => {
        const value = data.value
        const handler = handlers[value.type]
        const wildcardHandler = handlers['*']
        const next = err => {
          if (err) return cb(err)
          since = data.seq
          cb(null)
        }
        const handled = err => {
          if (err) return cb(err)
          callHandler(updateSince, next)(data.seq)
        }
        if (handler) {
          callHandler(handler, handled)(value.payload)
        } else if (wildcardHandler) {
          callHandler(wildcardHandler, handled)({
            payload: value.payload,
            type: value.type,
            seq: data.seq
          })
        } else {
          handled(null)
        }
      })

      pump(rs, handle, err => {
        if (err) onError(err)
        if (run) setTimeout(poll, err ? 30000 : 300)
      })
    }

    return () => {
      run = false
      close()
    }
  }
}
