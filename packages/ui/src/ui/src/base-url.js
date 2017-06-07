import cookie from 'cookie-monster'

export default cookie.get('LEVEL_EVENTSTORE_UI_REACT_APP_BASE_URL') || ''
