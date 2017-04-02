const once = require('once')
const db = require('./db')
const logs = require('./logs')(db)

module.exports = (cb) => {
  cb = once(cb)
  const sequences = {}
  logs.list((err, names) => {
    if (err) return cb(err)
    let pending = names.length
    if (!names.length) done()
    names.forEach((name) => {
      logs.head(name, (err, seq) => {
        if (err) return cb(err)
        sequences[name] = seq
        pending--
        if (!pending) done()
      })
    })
  })

  function done () {
    cb(null, sequences)
  }
}
