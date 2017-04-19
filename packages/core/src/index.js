if (!module.parent) {
  require('./server')
} else {
  const client = require('./client')
  module.exports = { client }
}
