const graphql = require('./graphql')
const credentials = process.env.CREDENTIALS || 'guest:guest'

require('server-base')({
  '@setup' (ctx, router) {
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
  '/graphql*': {
    post: graphql.query,
    get: graphql.html
  }
}).start(process.env.PORT || 5000)
