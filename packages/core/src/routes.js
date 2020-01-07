const append = require('./append')
const auth = require('./auth')

module.exports = routes

function routes ({ sequences }) {
  return {
    '@setup': ctx => {
      ctx.use((req, res, next) => {
        auth(req, err => {
          if (err) {
            res.writeHead(401, { 'WWW-Authenticate': 'Basic' })
            res.end('Access denied')
          } else {
            next()
          }
        })
      })
    },
    '/append': {
      put: append(sequences)
    }
  }
}
