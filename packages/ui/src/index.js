const service = require('server-base')
const serve = require('serve-create-react-app')('LEVEL_EVENTSTORE_UI_REACT_APP_BASE_URL')
const Moment = require('moment')

const client = require('level-eventstore').client({
  wsUrl: process.env.EVENTSTORE_URL || 'ws://guest:guest@eventstore:5000'
})

service('level-eventstore-ui', {
  '@setup': (ctx, router) => {
    ctx.use((req, res, next) => {
      if (router.get(req.url).handler) return next()
      serve(req, res)
    })
  },
  '/api/logList': {
    * get (req, res) {
      const list = yield (cb) => client.logList(cb)
      res.json(list)
    }
  },
  '/api/logStream/:log/:since': {
    get (req, res, params) {
      params.log = params.log || ''
      params.since = +params.since || 0
      const rows = []
      const stream = client.logStream(params.log, {
        since: +params.since,
        reverse: true,
        limit: 100
      }, (err) => {
        if (err) return res.error(err)
        res.json(rows)
        res.end()
      })
      stream.on('data', (data) => {
        data.value.createdAt = new Moment(data.value.createdAt).fromNow()
        rows.push(data)
      })
    }
  },
  '/api/streamById/:log/:id/:since': {
    get (req, res, params) {
      params.log = params.log || ''
      params.id = params.id || ''
      params.since = +params.since || 0
      const rows = []
      const stream = client.streamById(params.log, params.id, { since: params.since }, (err) => {
        if (err) return res.error(err)
        res.json(rows)
        res.end()
      })
      stream.on('data', (data) => {
        data.value.createdAt = new Moment(data.value.createdAt).fromNow()
        rows.push(data)
      })
    }
  }
}).start(5000)
