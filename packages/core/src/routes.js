const append = require('./append')

module.exports = routes

function routes ({ sequences, credentials }) {
  return {
    '@setup': ctx => {
      ctx.use((req, res, next) => {
        if (req.headers.authorization) {
          const auth = Buffer.from(
            req.headers.authorization.slice(6),
            'base64'
          ).toString()
          if (auth === credentials) return next()
        }
        res.writeHead(401, { 'WWW-Authenticate': 'Basic' })
        res.end('Access denied')
      })
    },
    '/append': {
      put: append(sequences)
    }
  }
}
