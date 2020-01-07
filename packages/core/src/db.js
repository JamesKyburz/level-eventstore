const level = require('level-party')

module.exports = level('./eventstore', {
  keyEncoding: 'utf-8',
  valueEncoding: 'json'
})
