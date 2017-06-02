import fetch from './fetch'
import cookie from 'cookie-monster'

const baseUrl = cookie.get('LEVEL_EVENTSTORE_UI_REACT_APP_BASE_URL') || ''

export default () => {
  const get = (url) => fetch(baseUrl + url, {
    method: 'GET',
    headers: { 'accept': 'application/json' }
  })

  return {
    logList () {
      return get('/api/logList')
    },
    logStream (log, since) {
      return get(`/api/logStream/${log}/${since}`)
    },
    streamById (log, id, since) {
      return get(`/api/streamById/${log}/${id}/${since}`)
    }
  }
}
