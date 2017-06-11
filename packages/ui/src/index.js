const service = require('server-base')
const path = require('path')
const serve = require('serve/lib/server')
const Moment = require('moment')

const client = require('level-eventstore').client({
  wsUrl: process.env.EVENTSTORE_URL || 'ws://guest:guest@eventstore:5000'
})

const uiIgnored = [ '.DS_Store', '.git/', 'node_modules' ]
const uiPath = path.join(__dirname, 'ui/build/')
const uiFlags = { single: true, auth: !!process.env.SERVE_USER }

process.env.ASSET_DIR = '/' + Math.random().toString(36).substr(2, 10)

service('level-eventstore-ui', {
  '@setup': (ctx, router) => {
    ctx.use((req, res, next) => {
      if (router.get(req.url).handler) return next()
      if (req.url.match(/css$/i)) req.url = req.url.match(/\/css\/.*/i)[0]
      if (req.url.match(/js$/i)) req.url = req.url.match(/\/static\/js.*/i)[0]
      const cookieValue = encodeURIComponent(process.env.REACT_APP_BASE_URL)
      const cookieName = 'LEVEL_EVENTSTORE_UI_REACT_APP_BASE_URL'
      const cookie = `${cookieName}=${cookieValue}; Path=/;`
      res.setHeader('Set-Cookie', cookie)
      serve(req, res, uiFlags, uiPath, uiIgnored)
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
